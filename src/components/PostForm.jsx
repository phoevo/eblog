import { useState } from "react";
import db from "../appwrite/databases";
import PropTypes from "prop-types";
import "../styles/CreatePost.css";
import { storage } from "../appwrite/config";
import useFileUpload from "../hooks/useFileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

function PostForm({ setPosts }) {
  const [fileName, handleFileChange] = useFileUpload();
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState(false);



  const handleAdd = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setPosted(false);
    setError(false);

    const postTitle = e.target.title.value;
    const postBody = e.target.body.value;
    const postImage = e.target.image.files[0];

    if (!postTitle || !postBody) {
      setLoading(false);
      return;
    }

    try {
      let imageId = null;

      if (postImage) {
        const bucketId = import.meta.env.VITE_BUCKET_ID;
        const imageResponse = await storage.createFile(bucketId, "unique()", postImage);
        imageId = imageResponse.$id;
      }

      const payload = { title: postTitle, body: postBody, imageId: imageId };
      const response = await db.posts.create(payload);

      if (response && response.$id) {
        setPosts((prevState) => [response, ...prevState]);
        setPosted(true);
        e.target.reset();
      } else {
        console.error("Post creation failed. No response ID found.");
        setPosted(false);
        setError(true);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setPosted(false);
      setError(true);
        } finally {
      setLoading(false);
    }
  };

  return (
    <section className="createPostPage">
      <form className="postForm" onSubmit={handleAdd}>
        <input className="titleInput" type="text" name="title" placeholder="Title" required />
        <textarea className="bodyInput" name="body" placeholder="Body" required />


        <section className="file-upload-container-outer">


          <div className="file-upload-container">
            <input
              id="choosefileBtn"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="choosefileBtn" className="PostFileInput">
              Choose File
            </label>
            <span className="file-name">{fileName}</span>

            <button
              className={`addPostBtn ${loading ? "disabled-btn" : posted ? "success-btn" : error ? "error-btn" : ""}`}
              type="submit"
              disabled={loading || posted}
            >
              {loading ? (
                <>Adding Post<FontAwesomeIcon icon={faCircleNotch} spin className="mr-2"/></>
              ) : posted ? (
                "Post Added"
              ) : error ? (
                "Post Failed"
              ) : (
                "Add Post"
              )}
            </button>
          </div>
        </section>
      </form>
    </section>
  );
}

PostForm.propTypes = {
  setPosts: PropTypes.func.isRequired,
  loggedin: PropTypes.bool,
  setLoggedIn: PropTypes.func,
};

export default PostForm;
