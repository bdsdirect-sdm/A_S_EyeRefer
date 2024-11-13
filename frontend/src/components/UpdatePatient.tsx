import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const UpdatePatient:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const patientUUID = localStorage.getItem('patientId');

  useEffect(()=>{
    if(!token || !patientUUID){
      navigate('/login');
    }
    return ()=>{
      localStorage.removeItem('patientId');
      navigate('/patient');
    }
  },[])



  const fetchDocs = async () => {

    try {
      const response = await api.get(`${Local.GET_DOC_LIST}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Data---->", response.data);
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching doctor list');
    }
  };

  const { data: MDList, isLoading:isMDLoading, isError:isMDError, error:MDError } = useQuery({
    queryKey: ["MDList"],
    queryFn: fetchDocs,
  });

  
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

  const {data:Patient, isLoading, isError, error } = useQuery({
    queryKey:["Patient"],
      queryFn:getPatient,
  });

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    disease: Yup.string().required("Disease is required"),
    referedto: Yup.string().required("Select one"),
    address: Yup.string().required("Select one"),
    referback: Yup.string().required("Select one")
  })


  const updatePatient = async(data:any) => {
    try{
      await api.put(`${Local.EDIT_PATIENT}/${patientUUID}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Patient updated successfully");
      navigate("/patient");
      return;
    }
    catch(err:any){
      toast.error(err.response.data.message);
    }
  }

  const updateMutation = useMutation({
    mutationFn: updatePatient
  })

  const submitHandler = (values:any) => {
    updateMutation.mutate(values);
  }

  if(isLoading || isMDLoading){
    return (
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )
  }

  if(isError || isMDError){
    return(
      <>
        <div>Error: {error?.message}</div>
        <div>Error: {MDError?.message}</div>
      </>
    )
  }

  console.log(Patient);
  console.log(MDList);

  var referback
  if(Patient.patient.referback)
  {
    referback = "1"
  }
  else{
    referback = "0"
  }

  return (
    <div>
      <Formik
      initialValues={{
        firstname:Patient.patient.firstname,
        lastname: Patient.patient.lastname,
        disease: Patient.patient.disease,
        referedto: Patient.patient.referedto,
        address: Patient.patient.address,
        referback: referback
      }}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
      enableReinitialize

      >
        {({values}) => (<>
        <Form>
          <div className="form-group">
              <label>First Name:</label>
              <Field type="text" name="firstname" className="form-control" />
              <ErrorMessage name="firstname" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Last Name:</label>
              <Field type="text" name="lastname" className="form-control" />
              <ErrorMessage name="lastname" component="div" className="text-danger" />
            </div>
            <br />
            <div className="form-group">
              <label>Disease:</label>
              <Field as='select' name='disease' className='form-select'>
                <option value="" disabled>Choose Disease</option>
                {['Disease 1', 'Disease 2', 'Disease 3', 'Disease 4', 'Disease 5'].map(disease => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </Field>
              <ErrorMessage name="disease" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Doctor:</label>
              <Field as='select' name='referedto' className='form-select'>
                <option value="" disabled>Choose Doctor</option>
                {MDList?.docList?.map((md: any) => (
                  <option key={md.uuid} value={md.uuid}>{md.firstname} {md.lastname}</option>
                ))}
              </Field>
              <ErrorMessage name="referedto" component="div" className="text-danger" />
            </div>
            <br />

            <div className='form-group' onClick={()=>{console.log("Values", values)}}>
              <label>Address:</label>
              <Field as='select' name='address' className='form-select'>
                <option value="" disabled>Choose Address</option>
                {values.referedto && MDList.docList.find((md: any) => md.uuid === values.referedto)?.Addresses.map((address: any) => (
                  <option key={address.uuid} value={address.uuid}>{address.street} {address.district} {address.city} {address.state}</option>
                ))}
              </Field>
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>
            <br />

            <div className="mb-3">
              <label className="form-label">Return back to referer</label>
              <div>
                <label className="me-3">
                  <Field name="referback" type="radio" value="1" /> Yes
                </label>
                <label>
                  <Field name="referback" type="radio" value="0" /> No
                </label>
                <ErrorMessage name="referback" component="div" className="text-danger" />
              </div>
            </div>
            <br />

            <button type="submit" className='btn btn-outline-dark px-5'>Update</button>
        </Form>
        </>)}
      </Formik>
    </div>
  )
}

export default UpdatePatient