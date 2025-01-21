//import React from 'react'
import "../styles/Navbar.css";
import { useNavigate } from 'react-router-dom';
function Navbar() {


  const navigate = useNavigate();

  return (
    <section className="navbar-section">
      <div className="navbar-div">

        <button onClick={() => navigate("/main")}>Blog</button>
        <button>Profile</button>
        <button onClick={() => navigate("/createPost")}>Create Post</button>
        <button>Contact</button>

      </div>

    </section>
  )
}

export default Navbar
