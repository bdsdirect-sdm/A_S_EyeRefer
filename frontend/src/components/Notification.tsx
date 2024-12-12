import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';

const Notification:React.FC = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token');
  
  useEffect(()=>{
    if(!token){
      navigate('/login');
    }

  },[])

  const getNotifications = async() => {
    try{
      const response = await api.get(`${Local.GET_NOTIFICATION_LIST}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(err:any){
      toast.error(err.response.data.message);
    }
  }

  const {data, isLoading, isError, error} = useQuery({
    queryKey:['notification'],
    queryFn: getNotifications
  })

  console.log(data);

  if(isLoading){
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

  if(isError){
    return(
      <>
        <div>Error: {error?.message}</div>
      </>
  )
  }

  return (
    <div>
      <h5 className='m-4' >Notifications</h5>

      <div className='bg-white ms-4 pt-5' >
        <div className='px-5'>
          <p className='mb-0'>blythe webb appointment has been completed with Dr. Sujal Anand</p>
          <span style={{fontSize:'12px'}} >Received 3 weeks ago</span>
          <hr />
        </div>
        <div className='px-5'>
          <p className='mb-0'>blythe webb appointment has been completed with Dr. Sujal Anand</p>
          <span style={{fontSize:'12px'}} >Received 3 weeks ago</span>
          <hr />
        </div>
      </div>
    </div>
  )
}

export default Notification