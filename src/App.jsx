import { useEffect, useState } from 'react'
import './App.css'
import Login from './Components/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import { userListener } from './Config/authCall'
import { AuthProvider } from './hooks/userAuth'
import { ProtectedRoute } from './Components/ProtectedRoute'


function App() {
  const [user,setUser]=useState(null);
  useEffect(()=>{
      userListener(listenUser)
  },[user]);

  const listenUser =(user) =>{
    setUser(user);
  }

  return (
    
      <div>
          <BrowserRouter>
          <AuthProvider>
          <Routes>
          <Route
            path='/login'
            element={<Login mail={'adrian.gottfried@softtek.com'}></Login>}
            >
            </Route>
            <Route
            path='/navbar'
            element={
              <ProtectedRoute>
                <Navbar></Navbar>
              </ProtectedRoute>
            }>
            </Route>
            <Route
            path='/'
            element={
              <ProtectedRoute>
              </ProtectedRoute>
            }>
            </Route>
          </Routes>
          </AuthProvider>
          </BrowserRouter>
       
      </div>
     
    
  )
}

export default App
