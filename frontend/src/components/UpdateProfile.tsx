// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const UpdateProfile:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const [User, setUser] = useState<any>({
  //   firstname: "",
  //   lastname: "",
  //   email: "",
  //   phone: "",
  //   dob: "",
  //   doctype:""
  // });

  useEffect(()=>{
    if(!localStorage.getItem("doctype")){
      navigate("/login");
    }

    const fetchUser = async() => {
      try{
        const response = await api.get(`${Local.GET_USER}`, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Data------->", response.data);
        let data:any = {};
        
        ["firstname", "lastname", "email", "phone", "dob", "doctype"].map((field:any)=>{
          data[`${field}`] = response.data.field;
        })
        // setUser(data);
        return;
      }
      catch(err:any){
        toast.error(`${err.response.message}`);
      }
    }
    
    fetchUser();

  },[])

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Last Name is required"),
    phone: Yup.string().min(10, "Invalid Phone number")

  });


  return (
    <>
    <div></div>
    </>
  )
}

export default UpdateProfile