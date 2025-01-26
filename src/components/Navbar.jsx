import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { account } from "../appwrite/config";

function Navbar({ loggedin, setLoggedIn }) {
  const navigate = useNavigate();

  // Logout functionality
  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Delete the current session
      setLoggedIn(false); // Set logged in state to false
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <section className="navbar-section">
      <div className="navbar-div">
        <button onClick={() => navigate("/")}>Blog</button>
        {loggedin && (<button onClick={() => navigate("/createPost")}>Create Post</button>)}

        <button onClick={() => navigate("/contact")}>Contact</button>

        {/* Conditionally render Login or Logout button based on loggedin state */}
        {loggedin && (<button onClick={handleLogout}>Logout</button>)}


      </div>
    </section>
  );
}

Navbar.propTypes = {
  loggedin: PropTypes.bool.isRequired, // Boolean indicating whether the user is logged in
  setLoggedIn: PropTypes.func.isRequired, // Function to update the loggedin state
};

export default Navbar;
