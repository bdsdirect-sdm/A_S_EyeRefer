import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar, { Logout } from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';
import '../Styling/Header.css'

const Header:React.FC = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
      Logout();
    }
  },[])
  return (

    <>
      <Navbar />
      <div className='d-flex'>

      <Sidebar />
      <div className='content mx-5'>
        <Outlet />
      </div>

      </div>
    </>
  )
}

export default Header
