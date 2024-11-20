import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';
import '../Styling/Header.css'

const Header:React.FC = () => {
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
