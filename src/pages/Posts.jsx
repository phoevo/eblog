import { useEffect, useState } from "react";
import db from "../appwrite/databases";
//import PostForm from "../components/PostForm";
import { Query } from "appwrite";
import Post from "../components/Post";
import "../styles/Post.css"


export default function Posts() {

  const[posts, setPosts] = useState([]);

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const response = await db.posts.list([
      Query.orderDesc('$createdAt')]
    );

    setPosts(response.documents)
  }
//<PostForm setPosts={setPosts} />
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
