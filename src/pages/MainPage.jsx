//import React from 'react'
import Posts from "./Posts"
import "../styles/MainPage.css"
import PropTypes from "prop-types"

function MainPage({posts, setPosts, loggedin}) {


  return (
    <section className="mainpage">

      <Posts posts={posts} setPosts={setPosts} loggedin={loggedin}/>

    </section>
  )
}

MainPage.propTypes = {
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
  loggedin: PropTypes.bool, // Must be a boolean
  setLoggedIn: PropTypes.func, // Must be a function
};



export default MainPage
