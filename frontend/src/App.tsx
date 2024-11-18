import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UpdateAppointment from './components/UpdateAppointment';
import AppointmentList from './components/AppointmentList';
import AddAppointment from './components/AddAppointment';
import UpdatePassword from './components/UpdatePassword';
import UpdateAddress from './components/UpdateAddress';
import UpdateProfile from './components/UpdateProfile';
import UpdatePatient from './components/UpdatePatient';
import ViewPatient from './components/ViewPatient';
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
import Chat from './components/Chat';
import react from 'react';
import './App.css';
import ViewAppointment from './components/ViewAppointment';

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
        },
        {
          path: '/update-patient',
          element: <UpdatePatient />
        },
        {
          path: '/view-patient',
          element: <ViewPatient />
        },
        {
          path: '/edit-address',
          element: <UpdateAddress />
        },
        {
          path: '/view-appointment',
          element: <ViewAppointment />
        },
        {
          path: '/appointment',
          element: < AppointmentList />
        },
        {
          path: '/add-appointment',
          element: < AddAppointment />
        },
        {
          path: '/edit-appointment',
          element: < UpdateAppointment />
        },
        {
          path: '/chat',
          element: < Chat />
        },
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
