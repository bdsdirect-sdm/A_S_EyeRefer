import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/title_logo.webp';
import './Header.css';
import { FaHome } from "react-icons/fa";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { CiStethoscope } from "react-icons/ci";
import { MdOutlineMarkChatRead } from "react-icons/md";
const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype: any = localStorage.getItem("doctype");
  const userFirstName = localStorage.getItem("user_firstname");
  const userLastName = localStorage.getItem("user_lastname");

  const fullName = userFirstName ? userFirstName : "User";
  const lastName = userLastName ? userLastName : "User";
  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={logo} alt="EyeRefer" className="logo-img" />
          </Link>
          <h4 className="logo-text">EYE REFER</h4>
        </div>

        <div className="header-right">
          <div className="user-actions">
            {token ? (
              <div className="dropdown">
                <button className="dropdown" aria-expanded="false">
                  Hi, {fullName} {lastName}  <br />Welcome Back <br />
                </button>
                <ul className="dropdown-menu">
                  <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                  <li><Link to="/update-password" className="dropdown-item">Change Password</Link></li>
                  <li><button className="dropdown-item" onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/" className="btn signup-btn">Sign-up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {token && (
        <div className="sidebar">
          <div className="sidebar-logo">
            {/* <img src={logo} alt="EyeRefer" className="sidebar-logo-img" /> */}
          </div>

          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link"><FaHome className="icon" />Dashboard</Link>
            <Link to="/patient" className="nav-link"><MdOutlinePersonalInjury className="icon" />Patient</Link>
            {doctype === '1' && <Link to="/appointment" className="nav-link">Appointments</Link>}
            <Link to="/doctor" className="nav-link"><CiStethoscope className="icon" />Doctors</Link>
            <Link to="/chat" className="nav-link"><MdOutlineMarkChatRead className="icon" />Chat</Link>
            <Link to="/staff" className="nav-link">Staff</Link>
            {doctype === '2' && <Link to="/add-patient" className="nav-link">Add Referral Patient</Link>}
          </nav>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Header;
