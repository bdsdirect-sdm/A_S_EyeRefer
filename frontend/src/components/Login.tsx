

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// import login_img from '../Assets/login-img.webp'
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import logo from '../Assets/login-img.webp';
import '../Styling/Login.css'

const Login:React.FC = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('doctype')){
      navigate('/dashboard');
    }
  },[]);

  const authUser = async(loginData: any) =>{
    try{
      const response:any = await api.post(`${Local.LOGIN_USER}`, loginData);
      console.log("Hello", response);
      if (response.status == 200){
        if(response.data.user.is_verified){
          localStorage.setItem("doctype", response.data.user.doctype);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('firstname', response.data.user.firstname);
          localStorage.setItem('lastname', response.data.user.lastname);
          localStorage.setItem('profile', response.data.user.profile_photo);
          toast.success("Login Successfully");
          navigate('/dashboard');
        }
        else{
          localStorage.setItem("email", response?.data?.user?.email);
          localStorage.setItem("OTP", response.data.OTP);
          toast.warn("User not Verified")
          navigate("/Verify");
        }
        return response;
      }
    }
    catch(err:any){
      toast.error(err?.response?.data?.message);
      return;
    }

  }

  const  validationSchema = Yup.object().shape({
    email:  Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character")
  })

  const loginMutate = useMutation({
    mutationFn: authUser,

  })

  const loginSubmit = async(values:any) => {
    loginMutate.mutate(values);
  }
  return (
    <div className="login-container">
      <div className="login-image">
        <img src={`${logo}`} width={200} alt="Login Illustration" />
      </div>

      <div className="login-form bg-light">
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={loginSubmit}
        >
          {() => (
            <Form className='form bg-white rounded border border-1 p-4 pt-5 h-75'>
              <div className="form-group">
                <div className='page-heading'><h2>Log In</h2></div>
                <label>Enter your email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  className="form-control"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label> Enter your Password</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your Password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              <Link to='/forget-password' className='nav-link fs-6 float-end text-info' >Forget Password?</Link>
              </div>
              <br /><br />
              <button type="submit" className="btn btn-info text-white w-100 py-2">
                Login
              </button>
              <div className="signup-link "><p>Don't have an Account ?

                <Link to='/signup' className='fw-bold text-info' >  Sign Up </Link></p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login