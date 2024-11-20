import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const UpdateAppointment:React.FC = () => {
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

  const {data:appointment, isLoading, isError, error} = useQuery({
    queryKey: ['appointment'],
    queryFn: getAppointment
  })

  const validationSchema = Yup.object().shape({
    patient: Yup.string().required(),
    date: Yup.date().min(new Date(), "Don't select past date").required("Appointment Date is required"),
    type: Yup.string().required("Type is required")
  });

  const updateAppointment = async(data:any) => {
    try{
      await api.put(`${Local.EDIT_APPOINTMENT}/${appointmentUUID}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("appointment updated successfully");
      navigate("/appointment");
      return;
    }
    catch(err:any){
      toast.error(err.response.data.message);
    }
  }

  const updateMutation = useMutation({
    mutationFn: updateAppointment
  })

  const submitHandler = (values:any) => {
    updateMutation.mutate(values);
  }

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

  console.log(appointment);

  return (
    <>
    <Formik
    initialValues={{
      patient: appointment.appointment.patientId.uuid,
      date: null,
      type: appointment.appointment.type
      }}
      validationSchema={validationSchema}
      onSubmit={submitHandler}>
        {()=>(
          <Form>
            <div className="form-group">
                <label>patient</label>
                <Field type="text" name="patient" className="form-control" hidden />
                  <input type="text" value={`${appointment.appointment.patientId.firstname} ${appointment.appointment.patientId.lastname}`} className='form-control' disabled/>
                <ErrorMessage name="patient" component="div" className="text-danger"/>
              </div>
              <br />

              <div className="form-group">
                <label>Appointment Date</label>
                <Field type="date" name="date" className="form-control" />
                <ErrorMessage name="date" component="div" className="text-danger"/>
              </div>
              <br />

              <div className="form-group">
                <label>Type</label>
                <Field as='select' name='type' className='form-select'>
                <option value="" disabled> select type </option>
                <option value="1">Surgery</option>
                <option value="2">Consultation</option>
                
              </Field>
                <ErrorMessage name="type" component="div" className="text-danger"/>
              </div>
              <br />
              
              <button type="submit" className="btn btn-dark">Submit</button>
          </Form>
        )}
    </Formik>
    </>
  )
}

export default UpdateAppointment 