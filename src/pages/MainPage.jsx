//import React from 'react'
import Navbar from "../components/Navbar"
import Posts from "./Posts"
import "../styles/MainPage.css"

function MainPage() {
  return (
    <section className="mainpage">
      <Navbar />
      <Posts />
    </section>
  )
}

export default MainPage
