import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styling/Dashboard.css';
import ref from '../Assets/ref.svg';
import refcom from '../Assets/refcom.svg';
import doc from '../Assets/doc.png'

const Dashboard:React.FC = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token");
    
    useEffect(()=>{
        if(!token){
            navigate("/login");
        }
        alert("Pagination is pending.........");
    },[]);


    const viewNavigator = (patientUUID:any) => {
        localStorage.setItem("patientId", patientUUID);
        navigate("/view-patient"); 
      }


    const getUser = async() => {
        try{
            console.log("Hello")
            const response = await api.get(`${Local.GET_USER}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Response-------->", response);
            return response;
        }
        catch(err){
            console.log("Error-------->", err);
            return;
        }
    }
    
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser
    });

    const getPatients = async() => {
        try{
          const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data;
        }
        catch(err:any){
          console.log(err.response.data.message);
          return;
        }
      }
    
      const { data:patientList, isLoading:patientloading, isError:ispatientError, error:patientError } = useQuery({
        queryKey: ['patients'],
        queryFn: getPatients
      })

    if(isLoading || patientloading ){
        return (
        <>
        <div className='loading-icon'>
            <div className="spinner-border spinner text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className='me-2 fs-2' >Loading...</div>
        </div>
        </>
        )
    }

    if(isError || ispatientError){
        return(
            <>
            <div>Error: {error?.message}</div>
            <div>Error: {patientError?.message}</div>
            </>
        )
    }

  return (
    <div className='dashboard-containe me-3' >
        <div>
            <p className='' >Dashboard</p>

            <div className='d-flex dash-box justify-content-between' >
                
                <div className='bg-white chng-pointer pt-2 rounded-1 w-25' onClick={()=>{
                    navigate('/patient');
                }}>
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${ref}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' > {data?.data.referCount} </h3>
                    </div>
                    <div className='d-flex' >
                        <p className='ms-3 referal-placed fw-bold' >Referrals Placed</p>
                        <p className=' me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

                <div className='bg-white chng-pointer pt-2 rounded-1' onClick={()=>{
                    navigate('/patient');
                }} >
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${refcom}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' > {data?.data.referCompleted} </h3>
                    </div>
                    <div className='d-flex' >
                        <p className='ms-3 referal-placed fw-bold ' >Referrals Completed</p>
                        <p className=' ms-4 me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

                <div className='bg-white chng-pointer pt-2 rounded-1 w-25' onClick={()=>{
                    navigate('/doctor');
                }}>
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${doc}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' > {data?.data.docCount} </h3>
                    </div>
                    <div className='d-flex' >

                        {localStorage.getItem('doctype') == '1' &&(
                            <p className='ms-3 referal-placed' >Doctor OD/MD</p>
                        )}
                        {localStorage.getItem('doctype') == '2' &&(
                            <p className='ms-3 referal-placed fw-bold' >Doctor MD</p>
                        )}

                        <p className=' me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

            </div>
        </div>
        
        <div>
            
            <div className='d-flex  mt-4'>
                <h5 className='mt-2' > Referral Patient </h5>
                <button type="button" className=' add-refer-btn btn' onClick={()=>{
                    navigate('/add-patient');
                }} >+ Add Referral Patient </button>
            </div>
            
            <div>
                <table className="table table-hover mt-4 me-3">
                    <thead >
                        <tr className='table-head table-secondary ' >
                        <th scope="col"> Patient Name </th>
                        <th scope="col"> DOB </th>
                        <th scope="col"> Disease </th>
                        <th scope="col"> Date Sent </th>
                        <th scope="col"> Appointment Date </th>
                        <th scope="col"> Refered to </th>
                        <th scope="col"> Status </th>
                        <th scope="col"> Consult Note </th>
                        <th scope="col"> Ready to Return </th>
                        <th scope="col"> Direct Message </th>
                        <th scope="col"> Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientList.pList.map((patient:any)=>(
                            <>
                            <tr key={patient.uuid}>
                                <td> {patient.firstname} {patient.lastnamme} </td>
                                <td> Nov-21-2024 </td>
                                <td> {patient.disease} </td>
                                <td> Nov-11-2024 </td>
                                {(patient.patientId != null && (
                                    <td> {patient.patientId.date} </td>
                                ))}
                                {(patient.patientId == null && (
                                    <td> -- </td>
                                ))}
                                <td> {patient.refertodoc.firstname} {patient.refertodoc.lastname} </td>
                                {(patient.patientId != null && patient.patientId.status == 1 && (
                                    <td> Scheduled </td>
                                ))}
                                {(patient.patientId != null && patient.patientId.status == 2 && (
                                    <td> Cancelled </td>
                                ))}
                                {(patient.patientId != null && patient.patientId.status == 3 && (
                                    <td> Complete </td>
                                ))}
                                {(patient.patientId == null && (
                                    <td> -- </td>
                                ))}
                                <td> <Link to="#" onClick={()=>{alert("Under Process")}} >Yes</Link> </td>
                                {patient.referback && (
                                    <td>Yes</td>
                                )}
                                {patient.referback==false && (
                                    <td>No</td>
                                )}
                                <td> <Link to="/chat" >Link</Link> </td>
                                <td>
                                    <div className='dashboard-eye ms-2 rounded-1' >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye text-light" viewBox="0 0 16 16"
                                    onClick={()=>{viewNavigator(patient.uuid)}}>
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                    </svg>
                                    </div>
                                </td>
                                    
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        
        </div>

    </div>
  )
}

export default Dashboard
