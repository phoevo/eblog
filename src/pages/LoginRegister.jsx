import PropTypes from "prop-types";
import "../styles/LoginRegister.css";
import { account } from "../appwrite/config";

function LoginRegister({ setLoggedIn }) {
  const REDIRECT_URL = "http://localhost:5173/";
  const FAILURE_URL = "http://localhost:5173/fail";

  // Handles Google OAuth login
  async function handleLogin() {
    try {
      await account.createOAuth2Session("google", REDIRECT_URL, FAILURE_URL);

      const userDetails = await account.get();
      console.log("User details:", userDetails);

      const isAdmin = userDetails.email === "phoevo@gmail.com"; // Replace with your admin email
      setLoggedIn(isAdmin); // Set logged in state based on admin check
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your connection or try again.");
    }
  }

  return (
    <section className="login-section">
      <div className="login-page">
        <button onClick={handleLogin}>Login with Google</button>
      </div>
    </section>
  );
}

LoginRegister.propTypes = {
  setLoggedIn: PropTypes.func.isRequired, // Pass function to set logged in state
};

export default LoginRegister;
