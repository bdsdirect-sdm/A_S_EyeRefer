import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import logo from '../Assets/title_logo.webp'

const Header:React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const doctype:any = localStorage.getItem("doctype");
  return (
    <>
        {/* <nav className="navbar navbar-expand-lg w-100 bg-body-secondary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link active" >Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link active" >Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/verify" className="nav-link active" >Verify</Link>
                    </li>
                    
                </ul>
                </div>
            </div>
        </nav> */}
        <header className="p-3 text-bg-secondary">
    <div className="container">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <Link to="#" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <img src={logo} alt="EyeRefer" height={50} />
        </Link>

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          
          {token && (
            <>
          <li><Link to="/dashboard" className="nav-link px-2 text-white">Dashboard</Link></li>  {/* Main Dashboard  */}
          <li><Link to="/patient" className="nav-link px-2 text-white">Patient</Link></li>  {/* List of Patients  */}
          {(doctype == 1)&&(
            <>
              <li><Link to="/appointment" className="nav-link px-2 text-white">Appointments</Link></li>  {/* List of Patients  */}
            </>
          )}
          <li><Link to="/doctor" className="nav-link px-2 text-white">Doctors</Link></li>   {/* List of MDs  */}
          <li><Link to="/chat" className="nav-link px-2 text-white">Chat</Link></li>  {/* Chat with MDs */}
          <li><Link to="/staff" className="nav-link px-2 text-white">Staff</Link></li>   {/* Staff Members  */}
          {(doctype == 2)&&(
            <>
              <li><Link to="/add-patient" className="nav-link px-2 text-white">Add Referral Patient</Link></li>   {/* Staff Members  */}
            </>
          )}
            </>
          )}
        </ul>

        <div className="text-end">
            {token && (<>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Hi Doctor
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><Link className="dropdown-item" to="/update-password">Change Password</Link></li>
              {/* <li><hr className="dropdown-divider" /></li> */}
              <li><button type='button' className="dropdown-item" onClick={()=>{
                localStorage.clear();
                navigate("/login");
                }} >Logout</button></li>
            </ul>
          </div>
          

          
            </>)}
            {(!token) && (
                <>
                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>

                {/* <button type="button" className="btn btn-outline-light me-2">Login</button> */}
                <Link to="/" className="btn btn-warning">Sign-up</Link>

                </>
            )}
        </div>
      </div>
    </div>
  </header>
        
        <br />
        <Outlet />
    </>
  )
}

export default Header
