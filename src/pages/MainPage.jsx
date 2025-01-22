//import React from 'react'
import Navbar from "../components/Navbar"
import Posts from "./Posts"
import "../styles/MainPage.css"
import PropTypes from "prop-types"


function MainPage({posts, setPosts}) {




  return (
    <section className="mainpage">
      <Navbar />
      <Posts posts={posts} setPosts={setPosts}  />
    </section>
  )
}

MainPage.propTypes = {
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
};

export default MainPage
