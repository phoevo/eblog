import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PostForm from "./components/PostForm";
import LoginRegister from "./pages/LoginRegister";
import { account } from "./appwrite/config";
import "./App.css";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Intro from "./components/Intro";
import Fail from "./pages/Fail";

function AppContent() {
  const [posts, setPosts] = useState([]);
  const [loggedin, setLoggedIn] = useState(false);
  const location = useLocation();

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {

    async function checkUserSession() {
      try {
        const userDetails = await account.get();
        console.log("Logged-in user:", userDetails);

        const isAdmin = userDetails.email === ADMIN_EMAIL;
        setLoggedIn(isAdmin);
      } catch (error) {
        console.log("No active session:", error);
        setLoggedIn(false);
      }
    }

    checkUserSession();
  }, []);

  console.log(loggedin);

  return (
    <>
      {location.pathname === "/" && <Intro />}
      <Navbar loggedin={loggedin} setLoggedIn={setLoggedIn} />
      <div className="loggedin">
        {loggedin ? "Logged in as Admin" : "Not logged in"}
      </div>
      <Routes>
        <Route
          element={<MainPage posts={posts} setPosts={setPosts} loggedin={loggedin} />}
          path="/"
        />
        <Route element={<PostForm posts={posts} setPosts={setPosts} />} path="/createPost" />
        <Route
          element={<LoginRegister loggedin={loggedin} setLoggedIn={setLoggedIn} />}
          path="/login"
        />
        <Route element={<Fail/>} path="/fail" />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
