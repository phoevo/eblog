import "../styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { account } from "../appwrite/config";

function Navbar({ loggedin, setLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Logout functionality
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <section className="navbar-section">
      <div className="navbar-div">
      <button
          onClick={() => navigate("/")}
          className={isActive("/") ? "active" : ""}
        >
          Main
        </button>
        <button
          onClick={() => navigate("/blog")}
          className={isActive("/blog") ? "active" : ""}
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
