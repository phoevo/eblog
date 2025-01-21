//import React from 'react'
import db from '../appwrite/databases'
import PropTypes from 'prop-types'
import "../styles/CreatePost.css"
import Navbar from './Navbar'

function PostForm({ setPosts }) {

  const handleAdd = async(e) => {
    e.preventDefault()
    const postTitle = e.target.title.value
    const postBody = e.target.body.value

    if(postTitle === "")return
    if(postBody === "") return

    try{
      const payload = {title:postTitle, body:postBody}
      const response = await db.posts.create(payload)
      setPosts((prevState) => [response, ...prevState])

      e.target.reset()
    }catch(error){
      console.error(error)
    }

  }

  return (
    <section className="createPostPage">
    <Navbar />

    <div className="formDiv">
      <form className = "postForm" onSubmit={handleAdd}>

      <input
      type="text"
      name="title"
      placeholder="title"/>

      <input
      type="text"
      name="body"
      placeholder="body"
      />
      <button type="submit">Add post</button>

     </form>
    </div>
    </section>
  )
}

PostForm.propTypes = {
  setPosts: PropTypes.func.isRequired
}

export default PostForm
