import { BrowserRouter, Routes, Route} from "react-router-dom"
import Pages from "./pages/Posts"
import LoginRegister from "./pages/LoginRegister"

export default function App(){
  return <BrowserRouter>
    <Routes>
      <Route element={<Pages/>} path ="/"/>
      <Route element = {<LoginRegister/>} path = "/login"/>
    </Routes>
  </BrowserRouter>


}