import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const UpdatePassword:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token){
      navigate("/login")
    }
  },[]);

  const updatePassword = async(data:any) => {
    try{
      const resposne = await api.put(`${Local.EDIT_PASSWORD}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(`${resposne.data.message}`);
    }
    catch(err:any){
      toast.error(`${err.response.data.message}`);
    }
  }

  const updateMutation = useMutation({
    mutationFn: updatePassword
  })

  const validationSchema = Yup.object().shape({
    prevPassword: Yup.string().required("required current password"),
    newPassword: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character"),
    confirmPass:  Yup.string().required("Confirm Password is required")
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
  })

  const updateHandler = (values:any) => {
    const {confirmPass, ...data} = values;
    updateMutation.mutate(data);
  }

  return (
    <Formik
    initialValues={{
      prevPassword:"",
      newPassword:"",
      confirmPass:""
      }}
      validationSchema={validationSchema}
      onSubmit={updateHandler}
    >
      {()=> (
        <>
        <Form>
        <div className="form-group">
          <label>Current Password:</label>
          <Field type="password" name="prevPassword" minLength={8} className="form-control"/>
          <ErrorMessage name="prevPassword" component="div" className="text-danger"/>
        </div>
        <br />

        <div className="form-group">
          <label>New Password:</label>
          <Field type="password" name="newPassword" minLength={8} className="form-control"/>
          <ErrorMessage name="newPassword" component="div" className="text-danger"/>
        </div>
        <br />
        
        <div className="form-group">
          <label>Confirm Password:</label>
          <Field type="password" name="confirmPass" minLength={8} className="form-control"/>
          <ErrorMessage name='confirmPass' component="div" className='text-danger' />
        </div>
        <br />

        <button type='submit' className='btn btn-outline-primary'>Submit</button>
        </Form>
        </>
      )}
    </Formik>
  )
}

export default UpdatePassword