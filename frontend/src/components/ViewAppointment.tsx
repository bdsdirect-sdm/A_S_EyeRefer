import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import api from '../api/axiosInstance';

const ViewAppointment:React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const appointmentUUID = localStorage.getItem('appointmentId');

  useEffect(()=>{
    if(!token || !appointmentUUID){
      navigate('/login')
      }

    return ()=>{
      localStorage.removeItem('appointmentId');
      navigate('/appointment');
    }
  },[]);

  const getAppointment = async() => {
    try{
      const response = await api.get(`${Local.VIEW_APPOINTMENT}/${appointmentUUID}`, {
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

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['appointment'],
    queryFn: getAppointment
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

  console.log(data);

  return (
    <>
    <div className='bg-white mt-5 p-4' >
      <h4 className='ms-3' >Appointment Details</h4>

      <div>
        <div className='bg-secondary-subtle row mt-3 py-4 rounded mx-2 ' >
          <div className='col' >
            <b>Patient Name: </b> <span> {data.appointment.patientId.firstname} </span>
          </div>

          <div className='col' >
            <b>Type : </b> <span> {data.appointment.type==1 && ("Surgery")} {data.appointment.type==2 && ("Consultation")} </span>
          </div>
          
          <div className='col' >
            <b>Appointment Date: </b> <span> {data.appointment.date} </span>
          </div>
        </div>

        <div className='row' >
          <div className='my-4 ' >
            <b>Notes</b>
          </div>
          
          <div className='bg-secondary-subtle mt-2 row py-4 rounded ms-3 ' style={
            {width: '75vw'}
          } >
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum pariatur culpa totam voluptas voluptatibus ipsa sequi unde hic libero dolorem alias doloremque quas voluptate, adipisci eligendi dignissimos. Ullam, repellat quisquam?</p>
          </div>
        </div>

      </div>

    </div>
    </>
  )
}

export default ViewAppointment