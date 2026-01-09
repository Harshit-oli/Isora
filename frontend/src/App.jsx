import React from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword' 
import { useSelector } from 'react-redux'
import GetCurrentUser from './hooks/GetCurrentUser'
import Home from './pages/Home'
import GetSuggestedUsers from "./hooks/GetSuggestedUsers"
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import GetAllPost from './hooks/GetAllPost'
export const serverUrl="http://localhost:3000"
const App = () => {
  // GetCurrentUser(); 
  const {userData}=useSelector(state=>state.user);
  return (
    <div>
      <GetCurrentUser/>
      <GetSuggestedUsers/>
      <GetAllPost/>
      <Routes>
        <Route path='/signup' element={!userData ? <SignUp/> :<Navigate to={"/"}/>}/>
        <Route path='/login' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
        <Route path='/' element={userData?<Home/>:<Navigate to={"/login"}/>}/>
        <Route path='/forgot-password' element={!userData?<ForgotPassword/> : <Navigate to={"/"}/>}/>
        <Route path='/profile/:userName' element={userData?<Profile/>:<Navigate to={"/login"}/>}/>
        <Route path='/editProfile' element={userData?<EditProfile/>:<Navigate to={"/login"}/>}/>
        <Route path='/upload' element={userData?<Upload/>:<Navigate to={"/login"}/>}/>
      </Routes>
    </div>
  )
}

export default App
