import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    },[]);

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
            <div>Loading...</div>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
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

    console.log("d", data);
    console.log("p", patientList)
  return (
    <div className='dashboard-container' >
        <div>
            <p className='ms-5' >Dashboard</p>

            <div className='d-flex justify-content-around' >
                
                <div className='bg-white chng-pointer rounded-1 w-25' onClick={()=>{
                    navigate('/patient');
                }}>
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${ref}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' >312</h3>
                    </div>
                    <div className='d-flex' >
                        <p className='ms-3 referal-placed fw-bold' >Referrals Placed</p>
                        <p className=' me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

                <div className='bg-white chng-pointer rounded-1' onClick={()=>{
                    navigate('/patient');
                }} >
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${refcom}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' >220</h3>
                    </div>
                    <div className='d-flex' >
                        <p className='ms-3 referal-placed fw-bold ' >Referrals Completed</p>
                        <p className=' ms-2 me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

                <div className='bg-white chng-pointer rounded-1 w-25' onClick={()=>{
                    navigate('/doctor');
                }}>
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${doc}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' >45</h3>
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
            
            <div className='d-flex ms-5 mt-4'>
                <h6 className='' > Referral Patient </h6>
                <button type="button" className='me-5 add-refer-btn btn' onClick={()=>{
                    navigate('/add-patient');
                }} >+ Add Referral Patient </button>
            </div>
            <div></div>
        
        </div>

    </div>
  )
}

export default Dashboard
