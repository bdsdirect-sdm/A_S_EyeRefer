import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { queryClient } from '../main';
import api from '../api/axiosInstance';

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token) {
      navigate('/login')
    }

  }, []);

  const updateAppointmentStatus = async(data:any) =>{
    try{
      await api.put(`${Local.EDIT_APPOINTMENT}/${localStorage.getItem('appointmentUUID')}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem("appointmentUUID");
      queryClient.invalidateQueries({
        queryKey:["appointments"]
      });
      if(data.status == 3){
        toast.success("Appointment Completed Successfully");
      } else {
        toast.success("Appointment Cancelled Successfully");
      }
      return;
    }
    catch(err:any){
      toast.error(err.response.data.message);
      return;
    }
  }

  const getAppointments = async() => {
    try{
      const response = await api.get(`${Local.GET_APPOINTMENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(err){
      console.log(err);
    }
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments
  });

  if(isLoading){
    return(
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
        <div className='text-danger' >Error: {error.message}</div>
      </>
      )
  }

  console.log("Data--->", data);
  return (
    <>
    <div className='d-flex'>
      <h5 className='ms-3 pt-2' >Appointments</h5>
      <Link to='/add-appointment' className='btn btn-outline-dark ms-auto mt-2 mb-2 me-3' >Add Appointment</Link>
    </div>
    <br />
    <table className="table">
  <thead>
    <tr>
      <th scope="col">Patient Name</th>
      <th scope="col">Date</th>
      <th scope="col">Type</th>
      <th scope="col">Status</th>
      <th scope="col">Complete Appointment</th>
      <th scope="col">Cancel Appointment</th>
      <th scope="col">Action </th>
    </tr>
  </thead>
  <tbody>
    {data?.appointments?.map((appointment:any) =>(
      <>
      <tr>
        <td>{appointment?.patientId.firstname} {appointment?.patientId.lastname}</td>
        <td> {appointment?.date} </td>
        <td> {appointment.type == 1 && ("Surgery")} {appointment.type == 2 && ("Consultation")} </td>
        <td> {appointment.status == 1 && ("Scheduled")} {appointment.status == 2 && ("Cancelled")} {appointment.status == 3 && ("Complete")} </td>
        <td>
          {appointment.status == 1 && (
            <>
            
          <b className='text-success ' onClick={()=>{
                    localStorage.setItem("appointmentUUID", appointment.uuid);
                    updateAppointmentStatus({"status":3});
                  }}>
            Complete
          </b>        
          </>
          )}
          {appointment.status != 1 && ("--")}
        </td>
        <td >
        {appointment.status == 1 && (
          <>
          
          <b className='text-danger' onClick={()=>{
                    localStorage.setItem("appointmentUUID", appointment.uuid);
                    updateAppointmentStatus({"status":2});
                  }} >
            Cancel
          </b>
          </>
        )}

        {appointment.status != 1 && ("--") }
        </td>

        <td >
          <div className='d-flex'>

          <div className='dashboard-eye ms-2 pt-1 rounded-1' onClick={()=>{
            localStorage.setItem("appointmentId", appointment.uuid);
            navigate('/view-appointment');
          }} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye text-light" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
          </div>

          {appointment.status==1 && (
            <>
            <div className='bg-secondary-subtle ms-3 p-1 px-2 rounded-1 fw-bolder ' onClick={()=>{
              localStorage.setItem("appointmentId", appointment.uuid);
              navigate("/edit-appointment");
            }} >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-plus text-primary" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
              </svg>
            </div>
          </>
          )}
          </div>
        </td>
      </tr>
      </>
    ))}
  </tbody>
</table>
    </>
  )
}

export default AppointmentList