import { useState, useEffect } from "react";
import { storage } from "../appwrite/config";
import "../styles/Intro.css";
import db from "../appwrite/databases";

function Intro({ loggedin, editIcon }) {
  const [edit, setEdit] = useState(false);
  const [textColor, setTextColor] = useState("black");

  const [introinfo, setIntroInfo] = useState({
    introname: "",
    introbody: "",
    introImage: "",
    introBackgroundImage: "",
    textColor: "black", // Add textColor to state
  });

  const [introId, setIntroId] = useState(null);

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const response = await db.intro.list();
        if (response.documents.length > 0) {
          const existingIntro = response.documents[0];
          setIntroInfo({
            introname: existingIntro.introname,
            introbody: existingIntro.introbody,
            introImage: existingIntro.introImage || "",
            introBackgroundImage: existingIntro.introBackgroundImage || "",
            textColor: existingIntro.textColor || "black", // Fetch text color from DB
          });
          setTextColor(existingIntro.textColor || "black");
          setIntroId(existingIntro.$id);
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
      const introImageFile = e.target.introImage.files[0];
      const introBackgroundImageFile = e.target.introBackgroundImage.files[0];

      if (!introName || !introBody) {
        console.error("Name and Message are required.");
        return;
      }

      let introImage = introinfo.introImage;
      let introBackgroundImage = introinfo.introBackgroundImage;
      const bucketId = import.meta.env.VITE_BUCKET_ID;

      if (introImageFile) {
        try {
          const imageResponse = await storage.createFile(bucketId, "unique()", introImageFile);
          introImage = imageResponse.$id;
        } catch (uploadError) {
          console.error("Error uploading profile image:", uploadError);
          return;
        }
      }

      if (introBackgroundImageFile) {
        try {
          const bgImageResponse = await storage.createFile(bucketId, "unique()", introBackgroundImageFile);
          introBackgroundImage = bgImageResponse.$id;
        } catch (uploadError) {
          console.error("Error uploading background image:", uploadError);
          return;
        }
      }

      const payload = {
        introname: introName,
        introbody: introBody,
        introImage,
        introBackgroundImage,
        textColor, // Save text color to DB
      };

      if (introId) {
        await db.intro.update(introId, payload);
      } else {
        const response = await db.intro.create(payload);
        setIntroId(response.$id);
      }

      setIntroInfo(payload);
      setEdit(false);
    } catch (error) {
      console.error("Error saving intro:", error);
    }
  };

  const toggleColor = async () => {
    const newColor = textColor === "black" ? "white" : "black";
    setTextColor(newColor);

    if (introId) {
      try {
        await db.intro.update(introId, { textColor: newColor }); // Update DB with new color
      } catch (error) {
        console.error("Error updating text color:", error);
      }
    }
  };

  const getImageUrl = (imageId) => {
    if (!imageId) return "";
    return storage.getFileView(import.meta.env.VITE_BUCKET_ID, imageId);
  };

  return (
    <section className="intro-section">
      {introinfo.introBackgroundImage && (
        <div
          className="intro-background"
          style={{
            backgroundImage: `url(${getImageUrl(introinfo.introBackgroundImage)})`,
          }}
        />
      )}

      <div className="introImage">
        {introinfo.introImage ? (
          <img src={getImageUrl(introinfo.introImage)} alt="Intro" className="introImage" />
        ) : (
          <div className="noImage">No Profile Picture</div>
        )}
      </div>

      {loggedin && (
          <button onClick={() => setEdit(!edit)} className="introEditIcon">
            {editIcon}
          </button>
      )}

      <div className="introText">
        <h1 className="introName" style={{ color: textColor }}>{introinfo.introname}</h1>
        <div className="introBody" style={{ color: textColor }}>{introinfo.introbody}</div>
      </div>

      {edit && (
        <form onSubmit={handleAdd} className="intro-form">
          <label>
            Name
            <input
              type="text"
              name="introname"
              value={introinfo.introname}
              onChange={(e) =>
                setIntroInfo({ ...introinfo, introname: e.target.value })
              }
            />
          </label>

          <label>
            Message
            <input
              type="text"
              name="introbody"
              value={introinfo.introbody}
              onChange={(e) =>
                setIntroInfo({ ...introinfo, introbody: e.target.value })
              }
            />
          </label>

          <button type="button" className="toggleTextColorBtn" onClick={toggleColor}>
            Toggle Text Color
          </button>

          <div>
            <label htmlFor="introImage">Choose Profile Picture</label>
            <input id="profilePicUpload" type="file" name="introImage" accept="image/*" />
          </div>

          <div>
            <label htmlFor="introBackgroundImage">Choose Background Image</label>
            <input id="backgroundUpload" type="file" name="introBackgroundImage" accept="image/*" />
          </div>

          <button className="introSaveBtn" type="submit">
            Save
          </button>
        </form>
      )}
    </section>
  );
}

export default Intro;
