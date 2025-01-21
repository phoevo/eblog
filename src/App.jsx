import { BrowserRouter, Routes, Route} from "react-router-dom"
import Posts from "./pages/Posts"
import LoginRegister from "./pages/LoginRegister"
import MainPage from "./pages/MainPage"
import PostForm from "./components/PostForm"
import "./App.css"

export default function App(){
  return <BrowserRouter>
    <Routes>
      <Route element = {<MainPage/>} path ="/main"/>
      <Route element = {<Posts/>} path ="/posts" />
      <Route element = {<PostForm/>} path ="/createPost" />
      <Route element = {<LoginRegister/>} path = "/login"/>
    </Routes>
  </BrowserRouter>


}