// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useNavigate, Link } from 'react-router-dom';
// import { useMutation } from '@tanstack/react-query';
// import { Local } from '../environment/env';
// import React, { useEffect } from 'react';
// import { toast } from 'react-toastify';
// import logo from '../Assets/title_logo.webp';
// import api from '../api/axiosInstance';
// import * as Yup from 'yup';
// import '../Styling/Login.css';

// const Login: React.FC = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (localStorage.getItem('doctype')) {
//       navigate('/dashboard');
//     }
//   }, []);

//   const authUser = async (loginData: any) => {
//     try {
//       const response: any = await api.post(`${Local.LOGIN_USER}`, loginData);
//       if (response.status === 200) {
//         if (response.data.user.is_verified) {
//           localStorage.setItem('doctype', response.data.user.doctype);
//           localStorage.setItem('token', response.data.token);
//           toast.success('Login Successfully');
//           navigate('/dashboard');
//         } else {
//           localStorage.setItem('email', response?.data?.user?.email);
//           localStorage.setItem('OTP', response.data.OTP);
//           toast.warn('User not Verified');
//           navigate('/Verify');
//         }
//         return response;
//       }
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message);
//       return;
//     }
//   };

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     password: Yup.string()
//       .min(8, 'Password must be at least 8 characters long')
//       .required('Password is required')
//       .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .matches(/\d/, 'Password must contain at least one number')
//       .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, 'Password must contain at least one special Character'),
//   });

//   const loginMutate = useMutation({
//     mutationFn: authUser,
//   });

//   const loginSubmit = async (values: any) => {
//     loginMutate.mutate(values);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <div className="logo">
//           <img src={logo} alt="Eye Refer Logo" height={20} />
//           <h1>EYE REFER</h1>
//         </div>
//       </div>
//       <div className="login-right">
//         <div className="login-form">
//           <h2>Log In</h2>
//           <Formik
//             initialValues={{
//               email: '',
//               password: '',
//             }}
//             validationSchema={validationSchema}
//             onSubmit={loginSubmit}
//           >
//             {() => (
//               <Form>
//                 <div className="form-group">
//                   <label>Email <span>*</span></label>
//                   <Field name="email" type="email" placeholder="Enter your Email" className="form-control" />
//                   <ErrorMessage name="email" component="div" className="text-danger" />
//                 </div>
//                 <div className="form-group">
//                   <label>Password <span>*</span></label>
//                   <Field
//                     name="password"
//                     type="password"
//                     placeholder="Enter your Password"
//                     className="form-control"
//                   />
//                   <ErrorMessage name="password" component="div" className="text-danger" />
//                 </div>
//                 <div className="form-actions">
//                   <button type="submit" className="btn btn-login">Login</button>
//                   <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//           <p>
//             Don't have an account? <Link to="/">Sign up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// import login_img from '../Assets/login-img.webp'
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import '../Styling/login.css'

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
          localStorage.setItem("doctype", response.data.user.doctype)
          localStorage.setItem("token", response.data.token);
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
    // <>
    // <div className='login-body' >

    //   <div className='login-left' >
    //   <img src={login_img} alt="Eye Refer Logo" height={200} />
    //   </div>

    //   <div className=' w-50 login-rigth' >
    //     <Formik
    //     initialValues={{
    //       email: '',
    //       password: '',
    //       }}
    //     validationSchema={validationSchema}
    //     onSubmit={loginSubmit}>
    //       {()=>(
    //         <div className='login-form' >
              
    //           <div className='heading'>
    //             Eye Refer
    //           </div>

    //         <Form  >
              
    //         </Form>
    //         </div>
    //       )}
    //     </Formik>
    //   </div>

    // </div>
    // </>
    <div>
      
      <Formik
      initialValues={{
        email: '',
        password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={loginSubmit}>
          {()=>(
            <Form>
              <div className="form-group">
                <label>Email</label>
                <Field name="email" type="email" placeholder="Enter your Email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field name="password" type="password" placeholder="Enter your Password" className="form-control"/>
                <ErrorMessage name="password" component="div" className="text-danger"/>
              </div>
              <Link className='float-end nav-link text-info' to={'/forget-password'} >Forget Password!</Link>
              <br />
              <br />
              <button type="submit" className='btn btn-info text-light w-25' >Login</button>
            </Form>
          )}
      </Formik>

        <br />
        <Link className='nav-link text-info' to={'/signup'} >Don't have an Account</Link>
    </div>
  )
}

export default Login