import React, { useEffect } from 'react'
<<<<<<< HEAD
import { Outlet } from 'react-router-dom'
=======
import { Outlet, useNavigate } from 'react-router-dom'
>>>>>>> 46f9aac1006e19b14d3ee8632a33a8aa74ee02bc
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';
import '../Styling/Header.css'

const Header:React.FC = () => {
<<<<<<< HEAD
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      window.location.href = '/login'
    }
=======
  const navigate = useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }

>>>>>>> 46f9aac1006e19b14d3ee8632a33a8aa74ee02bc
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
