import { useEffect} from "react";
import db from "../appwrite/databases";
import { Query } from "appwrite";
import Post from "../components/Post";
import "../styles/Post.css"
import PropTypes from "prop-types";


export default function Posts({posts, setPosts}) {


  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const response = await db.posts.list([
      Query.orderDesc('$createdAt')]
    );

    setPosts(response.documents)
  }

  return (
    <div className="posts-div">
      {posts.map(post => (
        <Post key={post.$id}
        setPosts={setPosts}
        postData={post}
        />
        //<div key={post.$id}>{post.body}</div>
      ))}
    </div>


  )
}

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      $id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    })
  ).isRequired,
  setPosts: PropTypes.func.isRequired,
};
