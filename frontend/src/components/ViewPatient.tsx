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
    <div className='bg-white pt-3 px-4 pb-3 mb-5' >
      <h4 className='mb-4' >Basic Information</h4>

      {/* Basic Info */}
      <div className='bg-secondary-subtle rounded-2 ps-5 mb-4' >
        <div className='row pb-3 pt-4'>
          <div className='col'>
            <b>Name: </b> <span>{Patient.patient.firstname} {Patient.patient.lastname} </span>
          </div>
          <div className='col'>
            <b>Gender: </b> <span>Male</span>
          </div>
          <div className='col'>
            <b>Date of Birth: </b> <span>Dec-12-2002</span>
          </div>
        </div>

        <div className='row pb-4'>
          <div className='col'>
            <b>Phone:</b> <span>1122334455</span>
          </div>
          
          <div className='col'>
            <b>Email :</b> <span>a@yopmail.com</span>
          </div>

          <div className='col'/>

        </div>
      </div>

      {/* Reason of Consult */}
      <div className='mb-4'>
        <h5 className='pb-3' >Reason of Consult</h5>

        <div className='bg-secondary-subtle rounded-2 ps-5' >
        <div className='row pb-3 pt-4'>
          <div className='col'>
            <b>Reason: </b> <span>{Patient.patient.disease} </span>
          </div>
          <div className='col'>
            <b>Laterality: </b> <span>Both</span>
          </div>
          <div className='col'>
            <b>Reason: </b> <span>{Patient.patient.disease}</span>
          </div>
        </div>

        <div className='row pb-4'>
          <div className='col'>
            <b>Timing:</b> <span>Routine (within 1 month) </span>
          </div>
          
          <div className='col'/>
          <div className='col'/>

        </div>
      </div>
        
      </div>

      {/* Referral OD/MD */}
      <div className='mb-4'>
        <h5 className='pb-3'>Referral OD/MD</h5>

        <div className='bg-secondary-subtle rounded-2 ps-5' >
          <div className='row pb-3 pt-4'>
            <div className='col'>
              <b>MD/OD Name: </b> <span>{Patient.referby.firstname} {Patient.referby.lastname} </span>
            </div>
            <div className='col'>
              <b>Address: </b> <span> {Patient.address.city} </span>
            </div>
            <div className='col' />
          </div>
      </div>
        
      </div>

      {/* Appointment Details */}
      <div className='mb-4'>
        <h5 className='pb-3'>Appointment Details</h5>

        <div className='bg-secondary-subtle rounded-2 ps-5' >
          <div className='row pb-3 pt-4'>
            <div className='col'>
              <b>Appointment Date Time : </b> <span> -- </span>
            </div>
            <div className='col'>
              <b>Type </b> <span> -- </span>
            </div>
            <div className='col' />
        </div>
      </div>
        
      </div>

      {/* Insurance Details */}
      <div className='mb-4'>
        <h5 className='pb-3'>Insurance Details</h5>

        <div className='bg-secondary-subtle rounded-2 ps-5' >
        <div className='row pb-3 pt-4'>
          <div className='col'>
            <b>Company Name : </b> <span> Company 1 </span>
          </div>
          <div className='col'>
            <b>Policy Start Date : </b> <span>Dec 22 2022</span>
          </div>
          <div className='col'>
          <b>Policy End Date : </b> <span>Nov-23-2027</span>
          </div>
        </div>
      </div>
        
      </div>

      {/* Documentation */}
      <div className='mb-4'>
        <h5 className='pb-3'> Documentation </h5>

        <div className='bg-secondary-subtle rounded-2 ps-5' >
        <div className='row pb-3 pt-4'>
          <div className='col'>
            <b>Upload Medical Documents: </b> <span> -- </span>
          </div>
          
          <div className='col' />
          <div className='col' />
        </div>

      </div>
        
      </div>

      {/* Note */}
      <div className='mb-4'>
        <h5 className='pb-3'>Notes</h5>

        <div className='bg-secondary-subtle rounded-2 ' >
          <div className='row pb-3 pt-4 mx-4'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere, aut officiis voluptatem est,
          ratione quibusdam vel id, hic deleniti error beatae minima atque corrupti cupiditate ullam architecto
          rerum dolore molestias.
          </div>
        </div>
        
      </div>

    </div>

  )
}

export default ViewPatient