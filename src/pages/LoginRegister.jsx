import PropTypes from "prop-types";
import "../styles/LoginRegister.css";
import { account } from "../appwrite/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";


function LoginRegister({ setLoggedIn }) {

  const googleIcon = <FontAwesomeIcon icon={faGoogle} />

  const REDIRECT_URL = import.meta.env.VITE_APPWRITE_REDIRECT_URL || "http://localhost:5173/";
  const FAILURE_URL = import.meta.env.VITE_APPWRITE_FAILURE_URL || "http://localhost:5173/fail";
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
  const DEV_EMAIL = import.meta.env.VITE_DEV_EMAIL

  const ADMIN_EMAILS = [ADMIN_EMAIL, DEV_EMAIL];


  async function handleLogin() {
    try {
      await account.createOAuth2Session("google",
        REDIRECT_URL,
        FAILURE_URL);

      const userDetails = await account.get();
      console.log("User details:", userDetails);

      const isAdmin = ADMIN_EMAILS.includes(userDetails.email);
      setLoggedIn(isAdmin);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your connection or try again.");
    }
  }



  return (
    <section className="login-section">
      <div className="login-page">
        <button onClick={handleLogin}><p className="googleIcon">{googleIcon}</p>
        Login with Google</button>
      </div>
    </section>
  );
}

LoginRegister.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
};

export default LoginRegister;
