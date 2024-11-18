import {Formik, Form, Field, ErrorMessage} from 'formik'
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const AddAppointment:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token){
      navigate('/login')
      }

  }, []);

  const AddAppointment = async(data:any) => {
    try{
      await api.post(`${Local.ADD_APPOINTMENT }`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Appointment set Successfully');
      navigate('/appointment');
      return;
    }
    catch(err:any){
      toast.error(err.response.data.message);
      return;
    }
  }

  const appointmentMutation = useMutation({
    mutationFn: AddAppointment
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients
  })

  const validationSchema = Yup.object().shape({
    patient: Yup.string().required("patient is required"),
    appointmentdate: Yup.date().min(new Date(), "Don't select past date").required("Appointment Date is required"),
    type: Yup.string().required("Type is required")
  });

  const submitHandler = (values:any) => {
    appointmentMutation.mutate(values);
  }

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

  console.log("Data  ", data);

  return (
    <div>
      <Formik
      initialValues={{
        patient: '',
        appointmentdate: null,
        type: ''
        }}
        validationSchema={validationSchema}
        onSubmit={submitHandler}>

          {()=>(
            <Form>
              <div className="form-group">
                <label>patient</label>
                <Field as='select' name='patient' className='form-select'>
                <option value="" disabled></option>
                {data.patientList.map(( patient:any )=>(
                  <>
                  <option key={patient.uuid} value={patient.uuid}> {patient.firstname} {patient.lastname} </option>
                  </>
                ))}

              </Field>
                <ErrorMessage name="patient" component="div" className="text-danger"/>
              </div>
              <br />

              <div className="form-group">
                <label>Appointment Date</label>
                <Field type="date" name="appointmentdate" className="form-control"/>
                <ErrorMessage name="appointmentdate" component="div" className="text-danger"/>
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
    </div>
  )
}

export default AddAppointment