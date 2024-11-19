import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
// import { Local } from '../environment/env';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const ForgetPassword:React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [email, setEmail] = useState('');

    useEffect(()=>{
        if(token){
            navigate('/dashboard');
        }
    },[]);

    const emailValidationSchema = Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const updatePasswordValidationSchema = Yup.object().shape({
      OTP: Yup.string().required("OTP is required").test("OTP Matched", "OTP Mismatch", (value:string)=>{
        return value === localStorage.getItem('OTP');
    }),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().required('Required').oneOf([Yup.ref('password')], 'Passwords must match'),
    });

    const emailSubmitHandler = async(values:any) =>{
      try{
        const response = await api.post('/forgetPasswordOTP', values);
        localStorage.setItem("OTP", response.data.OTP);
        toast.success("OTP sent");
        setEmail(values.email);
        console.log(response.data.OTP);
      }
      catch(err:any){
        toast.error(err.response.data.message);
      }
    }

    const updateHandler = async(values:any) => {
      console.log("Hello")
      const { password } = values;
      const d = {
        "email":email,
        "password":password
      };
      try{
        const response = await api.put('updateforgetedPassword', d);
        toast.success(response.data.message)
        navigate('/login');
      }
      catch(err:any){
        toast.error(err.response.data.message)
      }
    }

  return (
    <>
    {!(localStorage.getItem("OTP")) && (
      <Formik
      initialValues={{
        email:''
      }}
      validationSchema={emailValidationSchema}
      onSubmit={emailSubmitHandler}
      >
        {()=>(
          <Form>
            <div className="form-group">
              <label>Email</label>
              <Field type="text" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <br />
            <button type="submit" className="btn btn-info">Submit</button>
          </Form>
        )}
      </Formik>
    )}

    { localStorage.getItem("OTP") && (
      <Formik
      initialValues={{
        OTP:'',
        password:'',
        confirmPassword:''
      }}
      validationSchema={updatePasswordValidationSchema}
      onSubmit={updateHandler}
      >
        {({values})=>(
          <Form>
            <div className="form-group">
              <label>OTP</label>
              <Field type="text" name="OTP" className="form-control" />
              <ErrorMessage name="OTP" component="div" className="text-danger" />
            </div>
            {values.OTP == localStorage.getItem("OTP") && (
              <>
            <div className="form-group">
              <label>Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <Field type="password" name="confirmPassword" className="form-control" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>
              </>
            )}
            <br />
            <button type="submit" className="btn btn-info">Submit</button>
          </Form>
        )}
      </Formik>
    ) }
    </>
  )
}

export default ForgetPassword