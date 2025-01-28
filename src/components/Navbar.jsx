import "../styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { account } from "../appwrite/config";

function Navbar({ loggedin, setLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current URL path

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

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <section className="navbar-section">
      <div className="navbar-div">
        <button
          onClick={() => navigate("/")}
          className={isActive("/") ? "active" : ""}
        >
          Blog
        </button>
        {loggedin && (
          <button
            onClick={() => navigate("/createPost")}
            className={isActive("/createPost") ? "active" : ""}
          >
            Create Post
          </button>
        )}
        <button
          onClick={() => navigate("/contact")}
          className={isActive("/contact") ? "active" : ""}
        >
          Contact
        </button>

        {/* Conditionally render Login or Logout button based on loggedin state */}
        {loggedin && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </section>
  );
}

Navbar.propTypes = {
  loggedin: PropTypes.bool.isRequired, // Boolean indicating whether the user is logged in
  setLoggedIn: PropTypes.func.isRequired, // Function to update the loggedin state
};

export default Navbar;
