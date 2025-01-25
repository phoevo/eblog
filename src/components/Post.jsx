import { useState } from 'react';
import { databases, storage } from '../appwrite/config'; // Corrected import
import PropTypes from 'prop-types';
import "../styles/Post.css";

function Post({ setPosts, postData, loggedin }) {
  const [post, setPost] = useState(postData);

  const handleDelete = async () => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID, // Replace with your database ID
        import.meta.env.VITE_COLLECTION_ID, // Replace with your collection ID
        post.$id
      );
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
      {post.imageId && (
        <img
          src={getImageUrl(post.imageId)}
          alt={post.title}
          className="postImage"
        />
      )}
      <div className="postBody">{post.body}</div>
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
  postData: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageId: PropTypes.string, // Added imageId
  }).isRequired,
};

export default Post;
