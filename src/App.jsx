import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MainPage from "./pages/MainPage";
import PostForm from "./components/PostForm";
import LoginRegister from "./pages/LoginRegister";
import { account } from "./appwrite/config";
import "./App.css";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Intro from "./components/Intro";
import Fail from "./pages/Fail";
import Contact from "./pages/Contact";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./styles/Transitions.css"; // Add a CSS file for transitions
import Footer from "./components/Footer";

function AppContent() {
  const [posts, setPosts] = useState([]);
  const [loggedin, setLoggedIn] = useState(false);
  const location = useLocation();
  const editIcon = <FontAwesomeIcon icon={faPenToSquare} />;

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
    <div className="app-content">

<Navbar loggedin={loggedin} setLoggedIn={setLoggedIn} />

      {location.pathname === "/" && <Intro loggedin={loggedin} editIcon={editIcon} />}

      <TransitionGroup className="transitionGroup">
        <CSSTransition key={location.key} timeout={0}>
            <Routes location={location}>


              <Route
                element={<MainPage posts={posts} setPosts={setPosts} loggedin={loggedin} editIcon={editIcon} />}
                path="/blog"
              />
              <Route element={<PostForm posts={posts} setPosts={setPosts} />} path="/createPost" />
              <Route element={<LoginRegister loggedin={loggedin} setLoggedIn={setLoggedIn} />} path="/login" />
              <Route element={<Fail />} path="/fail" />
              <Route element={<Contact loggedin={loggedin} setLoggedIn={setLoggedIn} editIcon={editIcon} />} path="/contact" />
            </Routes>
        </CSSTransition>
      </TransitionGroup>

      <Footer />


    </div>
  );


}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
