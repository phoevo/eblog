import PropTypes from "prop-types";
import "../styles/LoginRegister.css";
import { account } from "../appwrite/config";

function LoginRegister({ setLoggedIn }) {

  const REDIRECT_URL = import.meta.env.VITE_APPWRITE_REDIRECT_URL || "http://localhost:5173/";
  const FAILURE_URL = import.meta.env.VITE_APPWRITE_FAILURE_URL || "http://localhost:5173/fail";
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "phoevo@gmail.com"

  async function handleLogin() {
    try {
      await account.createOAuth2Session("google",
        REDIRECT_URL, //CHANGE WITH VERCEL
        FAILURE_URL); //CHANGE WITH VERCEL

      const userDetails = await account.get();
      console.log("User details:", userDetails);

      const isAdmin = userDetails.email === ADMIN_EMAIL; //OR E'S EMAL
      setLoggedIn(isAdmin);
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
  setLoggedIn: PropTypes.func.isRequired,
};

export default LoginRegister;
