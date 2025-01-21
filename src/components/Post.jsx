import {useState} from 'react'
import db from '../appwrite/databases'
import PropTypes from 'prop-types'
import "../styles/Post.css"

function Post({setPosts, postData}) {

  // eslint-disable-next-line no-unused-vars
  const[post, setPost] = useState(postData)

  const handleDelete = async () => {
    db.posts.delete(post.$id)
    setPosts((prevState) =>
    prevState.filter((i) => i.$id !== post.$id))

  }

  return (
    <section className="post-section">
      <h1 className="postTitle">{postData.title}</h1>
      <div className="postBody">{postData.body} </div>
      <button onClick={handleDelete}>Delete</button>

    </section>
  )
}

Post.propTypes = {
  setPosts: PropTypes.func.isRequired,
  postData: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post
