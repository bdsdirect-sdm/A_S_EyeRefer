import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../Assets/title_logo.webp';
import '../Styling/Navbar.css';

const Navbar:React.FC = () => {
    const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    // const profile = localStorage.getItem('profile');

    const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar bg-white">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Section: Logo and Brand Name */}
        <div className="navbar-brand d-flex align-items-center">
          <img
            src={`${logo}`} // Replace with your logo source
            alt="Logo"
            height="40"
            className="d-inline-block align-text-top"
          />
          <p className="mt-2 ms-2 text-dark fw-bold">EYE REFER</p>
        </div>

        {/* Right Section: User Info */}
        <div className="d-flex align-items-center position-relative" onClick={toggleDropdown}>
          <img
            src="https://via.placeholder.com/40" // Replace with correct image source
            alt="User Profile"
            className="rounded-circle me-2"
            height="40"
            width="40"
          />
          <div className=" me-3">
            <p className="mb-0">Hi, {firstname} {lastname}</p>
            <p className="mb-0 small">Welcome Back</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-down"
            viewBox="0 0 16 16"
            style={{ cursor: "pointer" }}
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
          {/* Dropdown Menu */}
          {dropdownVisible && (
            <>
              <div className="dropdown-menu show position-absolute end-0 mt-5 dropd">
              <Link to='/profile' className="dropdown-item">
                Profile
              </Link>
              <Link to='/update-password' className="dropdown-item">
                Change password
              </Link>
              <button className="dropdown-item" onClick={()=>{
                localStorage.clear()
                navigate('/login');
              }} >
                Logout
              </button>
              
            </div>
            </>
          )}
        </div>
      </div>
    </nav>

  )
}

export default Navbar