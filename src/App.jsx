import { BrowserRouter, Routes, Route} from "react-router-dom"
import LoginRegister from "./pages/LoginRegister"
import MainPage from "./pages/MainPage"
import PostForm from "./components/PostForm"
import "./App.css"
import { useState } from "react"

export default function App(){

  const[posts, setPosts] = useState([]);

  const [loggedin, setLoggedIn] = useState(false)

  return <BrowserRouter>
    <Routes>
      <Route element = {<MainPage posts={posts} setPosts={setPosts}/> }  path ="/"/>
      <Route element = {<PostForm posts={posts} setPosts={setPosts}/>} path ="/createPost" />
      <Route element = {<LoginRegister loggedin={loggedin} setLoggedIn={setLoggedIn}/>} path = "/login"/>
    </Routes>
  </BrowserRouter>


}