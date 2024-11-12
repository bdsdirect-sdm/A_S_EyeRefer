import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UpdatePassword from './components/UpdatePassword';
import UpdateProfile from './components/UpdateProfile';
import PatientList from './components/PatientList';
import AddPatient from './components/AddPatient';
import DoctorList from './components/DoctorList';
import AddAddress from './components/AddAddress';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import StaffList from './components/StaffList';
import AddStaff from './components/AddStaff';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Header from './components/Header';
import Verify from './components/Verify';
import Login from './components/Login';
import react from 'react';
import './App.css';

const  App:react.FC = () => {

  const router = createBrowserRouter([
    {
      path:'/',
      element: <Header />,
      children:[
        {
          path:'/',
          element: <Signup />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/verify',
          element: <Verify />
        },
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/patient',
          element: <PatientList />
        },
        {
          path: '/add-patient',
          element: <AddPatient />
        },
        {
          path: '/doctor',
          element: <DoctorList />
        },
        {
          path: '/staff',
          element: <StaffList />
        },
        {
          path: '/add-staff',
          element: <AddStaff />
        },
        {
          path: '/add-address',
          element: <AddAddress />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/update-password',
          element: <UpdatePassword />
        },
        {
          path: '/edit-profile',
          element: <UpdateProfile />
        }
      ]
    }
  ]
)

  return (
<>
<RouterProvider router={router} />
<ToastContainer newestOnTop={false}
closeOnClick />
</>
  )
}

export default App
