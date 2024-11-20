import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/login-img.webp'
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import '../Styling/Login.css';
import * as Yup from 'yup';


const Verify:React.FC = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('OTP')){
            navigate('/login')
        }else{
            toast.info("OTP sent Successfully");
        }

        return ()=>{
            // localStorage.removeItem('OTP');
        }
    });

    const OTP:any = localStorage.getItem("OTP");
    const email:any = localStorage.getItem("email");

    const verifyUser = async() => {
        const resposne  =  await api.put(`${Local.VERIFY_USER}`, {email});
        return resposne;
    }
    
    const validationSchema = Yup.object().shape({
        otp: Yup.string().required("OTP is required").test("OTP Matched", "OTP Mismatch", (value:string)=>{
            return value === OTP;
        })
    })

    const verifyMutation = useMutation({
        mutationFn: verifyUser
    })

    const  handleSubmit = (values: any) => {
        // console.log(values);
        if (values.otp === OTP){
            toast.success("OTP Matched");
            verifyMutation.mutate(email)
            navigate('/Login');
        }
        else{
            toast.error("Invalid OTP");
        }
    }

  return (
    <>
    <div className="login-container">

        <div className="login-image">
            <img src={`${logo}`} width={200} alt="Login Illustration" />
        </div>
    
        <div className="login-form bg-light">
            <Formik
            initialValues={{
                otp: ''
                }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
                {() => (
                    <Form className='form bg-white rounded border border-1 p-4 pt-5 h-75'>
                        <div className='page-heading'><h2>Verify</h2></div>
                        <div className="form-group mt-5 ">
                            <label>OTP</label>
                            <Field type="text" name="otp" className="form-control" />
                            <ErrorMessage name="otp" component="div" className="text-danger" />
                        </div>
                        <br />
                            <button type="submit" className='btn btn-outline-dark' >Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    </div>
    </>
  )
}

export default Verify
