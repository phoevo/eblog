import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PostForm from "./components/PostForm";
import LoginRegister from "./pages/LoginRegister";
import { account } from "./appwrite/config";
import "./App.css";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loggedin, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in on app load
    async function checkUserSession() {
      try {
        const userDetails = await account.get();
        console.log("Logged-in user:", userDetails);

        // Check if the user is admin
        const isAdmin = userDetails.email === "phoevo@gmail.com"; // Replace with your admin email
        setLoggedIn(isAdmin);
      } catch (error) {
        console.log("No active session:", error);
        setLoggedIn(false);
      }
    }

    checkUserSession();
  }, []);

  console.log(loggedin)

  return (
    <BrowserRouter>
    <Navbar loggedin={loggedin} setLoggedIn={setLoggedIn} />
      <div className="loggedin">{loggedin ? "Logged in as Admin" : "Not logged in"}</div>
      <Routes>
        <Route element={<MainPage posts={posts} setPosts={setPosts} loggedin={loggedin} />} path="/" />
        <Route element={<PostForm posts={posts} setPosts={setPosts} />} path="/createPost" />
        <Route element={<LoginRegister loggedin={loggedin} setLoggedIn={setLoggedIn} />} path="/login" />
      </Routes>
    </BrowserRouter>
  );
}
