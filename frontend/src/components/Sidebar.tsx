import React from "react";
import { NavLink } from "react-router-dom";
import '../Styling/Sidebar.css'

const Sidebar:React.FC = () => {
  const doctype = localStorage.getItem('doctype');

  return (
    <div className="sidebar">
      <nav className="menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="icon bi bi-house-door "></i>
          <span className="menu-text px-2">Dashboard</span>
        </NavLink>

        <NavLink
          to="/patient"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="icon bi bi-person"></i>
          <span className="menu-text px-2">Patient</span>
        </NavLink>

        <NavLink
          to="/doctor"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="icon fa fa-stethoscope"></i>
          <span className="menu-text px-2">Doctors</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="icon bi bi-chat"></i>
          <span className="menu-text px-2">Chat</span>
        </NavLink>

        {doctype == '2' && (
        <NavLink
          to="/staff"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="icon bi bi-people"></i>
          <span className="menu-text px-2">Staff</span>
        </NavLink>
        )}

        {doctype == '1' && (
        <NavLink
          to="/appointment"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="icon bi bi-people"></i>
          <span className="menu-text px-2">Appointments</span>
        </NavLink>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
