// import { useQuery } from '@tanstack/react-query';
// import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import "./Dashboard.css";
// import { Link } from 'react-router-dom';

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         if (!token) {
//             navigate("/login");
//         }
//     }, [token, navigate]);
//     const getUser = async () => {
//         try {
//             const response = await api.get(`${Local.GET_USER}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             return response;
//         } catch (err) {
//             toast.error("Failed to fetch user data");
//         }
//     };

//     const fetchPatient = async () => {
//         try {
//             const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             return response.data;
//         } catch (err) {
//             toast.error("Failed to fetch patient data");
//         }
//     };

//     const { data: userData, isLoading: userLoading, isError: userError, error: userErrorDetails } = useQuery({
//         queryKey: ['dashboard'],
//         queryFn: getUser
//     });

//     const { data: patientsData, isLoading: patientsLoading, isError: patientsError, error: patientsErrorDetails } = useQuery({
//         queryKey: ['patients'],
//         queryFn: fetchPatient
//     });

//     if (userLoading || patientsLoading) {
//         return (
//             <div className="loading-container">
//                 <div>Loading...</div>
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//         );
//     }

//     if (userError || patientsError) {
//         return (
//             <div className="error-container">
//                 <div>Error: {userErrorDetails?.message || patientsErrorDetails?.message}</div>
//             </div>
//         );
//     }

//     const totalPatients = patientsData?.patientList?.length || 0;
//     const completedReferrals = patientsData?.patientList?.filter((patient: any) => patient.referalstatus)?.length || 0;
//     const pendingReferrals = totalPatients - completedReferrals;

//     return (
//         <div className="dashboard-container">
//             <h2 className="dashboard-title">Dashboard</h2>

//             <div className="doctor-info">
//                 <div className="info-item">
//                     <b>Doctor Name :  </b> {userData?.data.user.firstname} {userData?.data.user.lastname}
//                 </div>
//                 <div className="info-item">
//                     <b>Doctor Type : </b>  {userData?.data.user.doctype === 2 ? 'OD' : 'MD'}
//                 </div>
//             </div>

//             <div className="widgets-container">
//                 <div className="widget-card">
//                     <h3>Total Patients</h3>
//                     <p>{totalPatients}</p>
//                 </div>

//                 <div className="widget-card">
//                     <h3>Completed Referrals</h3>
//                     <p>{completedReferrals}</p>
//                 </div>

//                 <div className="widget-card">
//                     <h3>Pending Referrals</h3>
//                     <p>{pendingReferrals}</p>
//                 </div>

//                 <div className="widget-card">
//                     <h3>View Patient List</h3>
//                     <Link to="/patient">
//                         <button className="btn btn-outline-primary">View Patients</button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;
/////////////////////////////////////////////////////////////////
// import { useQuery } from '@tanstack/react-query';
// import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import './Dashboard.css';
// import { Link } from 'react-router-dom';

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         if (!token) {
//             navigate("/login");
//         }
//     }, [token, navigate]);

//     const getUser = async () => {
//         try {
//             const response = await api.get(`${Local.GET_USER}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             return response;
//         } catch (err) {
//             toast.error("Failed to fetch user data");
//         }
//     };

//     const fetchPatient = async () => {
//         try {
//             const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             return response.data;
//         } catch (err) {
//             toast.error("Failed to fetch patient data");
//         }
//     };

//     const fetchDoctors = async () => {
//         try {
//             const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             return response.data;
//         } catch (err) {
//             toast.error("Failed to fetch doctor data");
//         }
//     };

//     const { data: userData, isLoading: userLoading, isError: userError, error: userErrorDetails } = useQuery({
//         queryKey: ['dashboard'],
//         queryFn: getUser,
//     });

//     const { data: patientsData, isLoading: patientsLoading, isError: patientsError, error: patientsErrorDetails } = useQuery({
//         queryKey: ['patients'],
//         queryFn: fetchPatient,
//     });

//     const { data: doctorsData, isLoading: doctorsLoading, isError: doctorsError, error: doctorsErrorDetails } = useQuery({
//         queryKey: ['doctors'],
//         queryFn: fetchDoctors,
//     });

//     if (userLoading || patientsLoading || doctorsLoading) {
//         return (
//             <div className="loading-container">
//                 <div>Loading...</div>
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//         );
//     }

//     if (userError || patientsError || doctorsError) {
//         return (
//             <div className="error-container">
//                 <div>Error: {userErrorDetails?.message || patientsErrorDetails?.message || doctorsErrorDetails?.message}</div>
//             </div>
//         );
//     }

//     // Dynamic calculation for total patients, referrals completed, and referrals placed
//     const totalPatients = patientsData?.patientList?.length || 0;
//     const completedReferrals = patientsData?.patientList?.filter((patient: any) => patient.referalstatus)?.length || 0;
//     const pendingReferrals = totalPatients - completedReferrals;

//     const totalDoctors = doctorsData?.doctorsList?.length || 0;
//     const completedReferralsFromPatients = patientsData?.patientList?.filter((patient: any) => patient.referalstatus)?.length || 0;
//     const referralsPlacedFromPatients = patientsData?.patientList?.filter((patient: any) => !patient.referalstatus)?.length || 0;

//     return (
//         <div className="dashboard-container">
//             <div className="header">
//                 <h2 className="dashboard-title">Dashboard</h2>
//             </div>

//             <div className="sidebar">
//                 {/* Sidebar can be added here */}
//             </div>

//             <div className="content">
//                 <div className="widgets-container">


//                     <div className="widget-card">
//                         <h3>Referrals Placed</h3>
//                         <p>
//                             <img className="img-spacing" src='5be148eb11e3f4de1fe4.svg'></img>
//                             {referralsPlacedFromPatients}
//                         </p>
//                     </div>
//                     <div className="widget-card">
//                         <h3>Referrals Completed</h3>
//                         <p>{completedReferralsFromPatients}</p>
//                     </div>
//                     <div className="widget-card">
//                         <h3>MD</h3>
//                         <p>{totalDoctors}</p>
//                     </div>
//                 </div>
//                 <div className="widget-card">
//                     <h3>View Patient List</h3>
//                     <Link to="/patient">
//                         <button className="btn btn-outline-primary">View Patients</button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
////////////////
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const getUser = async () => {
        try {
            const response = await api.get(`${Local.GET_USER}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (err) {
            toast.error("Failed to fetch user data");
        }
    };

    const fetchPatientList = async () => {
        try {
            const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            toast.error("Failed to fetch patient data");
        }
    };

    const fetchDoctorList = async () => {
        try {
            const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            toast.error("Failed to fetch doctor data");
        }
    };

    const { data: userData, isError: userError, error: userErrorMsg, isLoading: userLoading } = useQuery({
        queryKey: ['userData', token],
        queryFn: getUser
    });

    const { data: patientData, isError: patientError, error: patientErrorMsg, isLoading: patientLoading } = useQuery({
        queryKey: ['patientData'],
        queryFn: fetchPatientList
    });

    const { data: doctorData, isError: doctorError, error: doctorErrorMsg, isLoading: doctorLoading } = useQuery({
        queryKey: ['doctorData'],
        queryFn: fetchDoctorList
    });

    if (userLoading || patientLoading || doctorLoading) {
        return (
            <div className="loading-container">
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (userError || patientError || doctorError) {
        return (
            <div className="error-container">
                <div>Error: {userErrorMsg?.message || patientErrorMsg?.message || doctorErrorMsg?.message}</div>
            </div>
        );
    }

    const { user } = userData?.data || {};
    const { patientList } = patientData || {};
    const { doctorList } = doctorData || {};

    localStorage.setItem("firstname", user.firstname)
    localStorage.setItem("lastname", user.lastname)

    console.log(user.firstname, "lkdsfjkldfjklsdj")

    const totalRefersReceived = patientList?.length || 0;
    const totalRefersCompleted = patientList?.filter((patient: { referalstatus: boolean }) => patient.referalstatus === true).length || 0;

    const totalDoctors = doctorList?.length || 0;

    return (
        <div className="dashboard-container">

            <h2 className="dashboard-title">Dashboard</h2>

            <div className="metrics-cards">
                <div className="card" onClick={() => navigate('/patient')}>
                    <div className="card-body">Referrals Placed
                        <div className='icon d-flex'>
                            <img src="5be148eb11e3f4de1fe4.svg" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalRefersReceived}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">Referrals Completed
                        <div className='icon d-flex'>
                            <img src="77540cee2e45a0c333cd.svg" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalRefersCompleted}</div>
                        </div>
                    </div>
                </div>

                <div className="card" onClick={() => navigate('/doctor')}>
                    <div className="card-body">MD
                        <div className='icon d-flex'>
                            <img src="0685f1c668f1deb33e75.png" alt="EyeRefer" className='icon-2' />
                            <div className="card-text">{totalDoctors}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='refer d-flex'>
                {user.doctype === 2 ? (<><h2 className="refer-title">Referrals Placed</h2><button className="appointment-btn" onClick={() => navigate("/add-patient")}>+Add Referral patient</button></>) : <><h2 className="refer-title">Add Appointment</h2><button className="appointment-btn" onClick={() => navigate("/appointments")}>+Add Appointment</button></>}


            </div>
            <div className="patient-list-section">
                <div className="patient-table-container">
                    <table className="table">
                        <thead>
                            <tr >
                                <th scope="col">Patient Name</th>
                                <th scope="col">Disease</th>
                                <th scope="col">Refer by</th>
                                <th scope="col">Refer to</th>
                                <th scope="col">Refer back</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientList?.map((patient: any, index: number) => (
                                <tr key={index}>
                                    <td>{patient.firstname} {patient.lastname}</td>
                                    <td>{patient.disease}</td>
                                    <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
                                    <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
                                    <td>{patient.referback ? 'Yes' : 'No'}</td>
                                    <td>
                                        <span className="status-color">{patient.referalstatus}
                                            {patient.referalstatus ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;