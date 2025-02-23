import db from '../appwrite/databases';
import PropTypes from 'prop-types';
import "../styles/CreatePost.css";
import { storage } from '../appwrite/config';
import useFileUpload from '../hooks/useFileUpload';

function PostForm({ setPosts }) {
  const [fileName, handleFileChange] = useFileUpload(); // Use the custom hook

  const handleAdd = async (e) => {
    e.preventDefault();
    const postTitle = e.target.title.value;
    const postBody = e.target.body.value;
    const postImage = e.target.image.files[0];

    if (!postTitle || !postBody) return; // Prevent empty posts

    try {
      let imageId = null;

      if (postImage) {
        const bucketId = import.meta.env.VITE_BUCKET_ID;
        const imageResponse = await storage.createFile(bucketId, 'unique()', postImage);
        imageId = imageResponse.$id;
      }

      const payload = { title: postTitle, body: postBody, imageId: imageId };

      const response = await db.posts.create(payload);
      setPosts((prevState) => [response, ...prevState]);
      e.target.reset();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <section className="createPostPage">
      <form className="postForm" onSubmit={handleAdd}>
        <input className='titleInput' type="text" name="title" placeholder="Title" />

        <textarea className='bodyInput' type="description" name="body" placeholder="Body" />

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
          <button className='addPostBtn' type="submit">Add post</button>

        </div>


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
