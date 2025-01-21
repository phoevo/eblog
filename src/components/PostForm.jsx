import React from 'react'
import db from '../appwrite/databases'

function PostForm({ setPosts }) {

  const handleAdd = async(e) => {
    e.preventDefault()
    const postBody = e.target.body.value

    if(postBody === "") return

    try{
      const payload = {body:postBody}
      const response = await db.posts.create(payload)
      setPosts((prevState) => [response, ...prevState])

      e.target.reset()
    }catch(error){
      console.error(error)
    }

  }

  return (
    <form onSubmit={handleAdd}>

      <input
      type="text"
      name="body"
      placeholder="placeholder"
      />
      <button type="submit">Add post</button>

    </form>
  )
}

export default PostForm
