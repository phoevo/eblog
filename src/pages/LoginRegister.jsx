import { account } from "../appwrite/config";
import App from "../App";

function LoginRegister({loggedin, setLoggedIn}) {
  // Hardcoded URLs for testing
  const REDIRECT_URL = "http://localhost:5173/";
  const FAILURE_URL = "http://localhost:5173/fail";

  // Handles Google OAuth login
  async function handleLogin() {
    try {
      await account.createOAuth2Session('google', REDIRECT_URL, FAILURE_URL);
      alert("Logged in successfully")


    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your connection or try again.");
    }
  }

  // Handles user logout
  async function signOut() {
    try {
      await account.deleteSession("current");
      alert("You have been logged out successfully.")


    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    }
  }


  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}

export default LoginRegister;
