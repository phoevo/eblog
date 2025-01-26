import { useState } from 'react';
import { databases, storage } from '../appwrite/config'; // Corrected import
import PropTypes from 'prop-types';
import "../styles/Post.css";

function Post({ setPosts, postData, loggedin }) {
  const [post] = useState(postData);

  const handleDelete = async () => {
    try {
      // Delete the post document
      await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_POSTS,
        post.$id
      );


      if (post.imageId) {
        await storage.deleteFile(
          import.meta.env.VITE_BUCKET_ID, // Bucket ID
          post.imageId // File ID
        );
      }

      // Update the posts state after deletion
      setPosts((prevState) => prevState.filter((i) => i.$id !== post.$id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getImageUrl = (imageId) => {
    const bucketId = import.meta.env.VITE_BUCKET_ID; // Replace with your bucket ID
    return storage.getFileView(bucketId, imageId);
  };

  return (
    <section className="post-section">
      <h1 className="postTitle">{post.title}</h1>
      <div className="postBody">{post.body}</div>

      {post.imageId && (
        <img
          src={getImageUrl(post.imageId)}
          alt={post.title}
          className="postImage"
        />
      )}


      {loggedin && (
        <button className="postDelete" onClick={handleDelete}>
          Delete
        </button>
      )}
    </section>
  );
}

Post.propTypes = {
  loggedin: PropTypes.bool,
  setPosts: PropTypes.func.isRequired,
  setPost: PropTypes.func,
  postData: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageId: PropTypes.string, // Optional imageId
  }).isRequired,
};

export default Post;
