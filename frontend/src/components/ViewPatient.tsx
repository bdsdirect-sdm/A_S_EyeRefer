import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import api from '../api/axiosInstance';

const ViewPatient:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const patientUUID = localStorage.getItem('patientId');

  useEffect(()=>{
    if(!token || !patientUUID){
      navigate('/login')
      }

    return ()=>{
      localStorage.removeItem('patientId');
      // history.back();
      // navigate('/dashboard');
    }
  },[])

  const getPatient = async() => {
    try{
      const response = await api.get(`${Local.VIEW_PATIENT}/${patientUUID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data
    }
    catch(err:any){
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
    }
  }

  const {data:Patient, isLoading, isError, error} = useQuery({
    queryKey: ['Patient'],
    queryFn: getPatient
  })

  if(isLoading){
    return (
    <>
      <div>Loading...</div>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </>
    )
  }

  if(isError){
    return(
      <>
        <div>Error: {error.message}</div>
      </>
  )
  }

  console.log(">>>   ", Patient)

  return (    
    <div>
      Name: {Patient?.patient.firstname} {Patient?.patient.lastname}
      <br />
      Disease: {Patient.patient.disease}
      <br />
      Refer to: {Patient.referto.firstname} {Patient.referto.lastname}
      <br />

      Refer by: {Patient.referby.firstname} {Patient.referby.lastname}
      <br />

      Status: {Patient.patient.referalstatus && ("Yes")} {Patient.patient.referalstatus==false && ("No")}
      <br />
      Back to referer: {Patient.patient.referback && ("Yes")} {Patient.patient.referback==false && ("No")}
      <br />

      Address: {Patient.address.street}, {Patient.address.district}, {Patient.address.city}, {Patient.address.state}
    </div>

  )
}

export default ViewPatient