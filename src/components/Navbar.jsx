//import React from 'react'
import LoginRegister from "../pages/LoginRegister";
import "../styles/Navbar.css";
import { useNavigate } from 'react-router-dom';
function Navbar() {


  const navigate = useNavigate();

  return (
    <section className="navbar-section">
      <div className="navbar-div">

        <button onClick={() => navigate("/")}>Blog</button>
        <button>Profile</button>
        <button onClick={() => navigate("/createPost")}>Create Post</button>
        <button>Contact</button>
        <LoginRegister />

      </div>

    </section>
  )
}

export default Navbar
