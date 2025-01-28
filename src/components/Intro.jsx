import { useState, useEffect } from "react";
import { databases, storage } from "../appwrite/config"; // Ensure you import the correct Appwrite services
import "../styles/Intro.css";
import db from "../appwrite/databases";

function Intro({ loggedin, editIcon }) {
  const [edit, setEdit] = useState(false);

  const [introinfo, setIntroInfo] = useState({
    introname: "",
    introbody: "",
    introImage: "", // Store the imageId here
  });

  const [introId, setIntroId] = useState(null);

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const response = await db.intro.list(); // Fetch intro data
        if (response.documents.length > 0) {
          const existingIntro = response.documents[0];
          setIntroInfo({
            introname: existingIntro.introname,
            introbody: existingIntro.introbody,
            introImage: existingIntro.introImage || "", // Fetch the introImage field
          });
          setIntroId(existingIntro.$id); // Save the document ID for updates
        }
      } catch (error) {
        console.error("Error fetching intro info:", error);
      }
    };

    fetchIntro();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const introName = e.target.introname.value;
      const introBody = e.target.introbody.value;
      const introImageFile = e.target.image.files[0];

      if (!introName || !introBody) {
        console.error("Name and Message are required.");
        return;
      }

      let introImage = introinfo.introImage; // Keep existing image unless a new one is uploaded

      // Handle image upload if a new image is provided
      if (introImageFile) {
        try {
          const bucketId = import.meta.env.VITE_BUCKET_ID; // Bucket ID from environment variables
          const imageResponse = await storage.createFile(
            bucketId,
            "unique()", // Auto-generate a unique file ID
            introImageFile
          );
          introImage = imageResponse.$id; // Update with the new imageId
          console.log("Uploaded Image ID:", introImage); // Debug log
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          return;
        }
      }

      const payload = {
        introname: introName,
        introbody: introBody,
        introImage, // Save the new or existing imageId
      };

      console.log("Payload:", payload); // Debug log

      if (introId) {
        const response = await db.intro.update(introId, payload); // Update the existing intro
        console.log("Intro updated:", response);
      } else {
        const response = await db.intro.create(payload); // Create a new intro
        console.log("Intro created:", response);
        setIntroId(response.$id); // Save the new introId
      }

      setIntroInfo(payload);
      setEdit(false); // Close edit mode
    } catch (error) {
      console.error("Error saving intro:", error);
    }
  };

  const handleEdit = () => {
    setEdit((prevEdit) => !prevEdit);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIntroInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Fetch the image URL using the introImage ID
  const getImageUrl = (imageId) => {
    const bucketId = import.meta.env.VITE_BUCKET_ID;
    const url = storage.getFileView(bucketId, imageId); // Generate the public URL
    console.log("Generated URL:", url); // Debug log
    return url;
  };

  // Test code: Hardcoded image ID for debugging purposes
  useEffect(() => {
    const testImageId = "6798fe7f000219b02bb9"; // Replace with a valid imageId for testing
    setIntroInfo((prevInfo) => ({
      ...prevInfo,
      introImage: testImageId,
    }));
    console.log("Testing with hardcoded image ID:", testImageId);
  }, []);

  return (
    <section className="intro-section">
      <div className="pic">
        {introinfo.introImage ? (
          <img
            src={getImageUrl(introinfo.introImage)}
            alt="Intro"
            className="introImage"
          />
        ) : (
          <div className="noImage">No Image</div>
        )}
      </div>

      {loggedin && (
        <button onClick={handleEdit} className="editIcon">
          {editIcon}
        </button>
      )}

      <div>
        <h1>{introinfo.introname}</h1>
        <div>{introinfo.introbody}</div>
      </div>

      {edit && (
        <form onSubmit={handleAdd} className="intro-form">
          <label>
            Name
            <input
              type="text"
              placeholder="Name"
              name="introname"
              value={introinfo.introname}
              onChange={handleChange}
            />
          </label>

          <label>
            Message
            <input
              type="text"
              placeholder="Message"
              name="introbody"
              value={introinfo.introbody}
              onChange={handleChange}
            />
          </label>

          <div>
            <input
              id="choosefileBtn"
              type="file"
              name="image"
              accept="image/*"
            />
            <label htmlFor="choosefileBtn" className="fileInput">
              CHOOSE FILE
            </label>
          </div>

          <button className="saveBtn" type="submit">
            SAVE
          </button>
        </form>
      )}
    </section>
  );
}

export default Intro;
