import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DoctorList:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!localStorage.getItem("doctype")){
      navigate("/login");
    }
  },[]);

  const fetchDoctors = async() => {
    try{
      const response = await api.get(`${Local.GET_DOC_LIST}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      return response.data;
    }
    catch(err){
      toast.error(`${err}`);
    }
  }
 
  const { data: Doctors, error, isLoading, isError } = useQuery({
    queryKey: ['doctor'],
    queryFn: fetchDoctors
  })

  if(isLoading){
    return(
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )}

  if(isError){
    return(
      <>
      <div className='text-danger' >Error: {error.message}</div>
      </>
      )}

      console.log("---------->", Doctors);

  return (
    <>
    <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col"> Name </th>
      <th scope="col"> email </th>
      <th scope="col"> Doctor Type </th>
    </tr>
  </thead>
  <tbody>
    {Doctors.docList.map((doctor:any,index:number) =>(
      <>
      <tr>
        <td className='fw-bold' > {index+1} </td>
        <td>{doctor.firstname} {doctor.lastname}</td>
        <td> {doctor.email} </td>
        <td> {doctor.doctype==1 && ("MD")} {doctor.doctype==2 && ("OD")} </td>

      </tr>
      </>
    ))}
  </tbody>
</table>
    </>
  )
}

export default DoctorList
