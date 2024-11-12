import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

interface User {
  firstname: string;
  lastname: string;
  email: string;
  doctype: string;
  dob: any;
  phone:string;
}

const UpdateProfile:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);

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

        let data:any = {};
        
        ["firstname", "lastname", "email", "phone", "dob"].map((field:any)=>{
          data[`${field}`] = response.data.user[`${field}`];
        })
        if(response.data.user.doctype == 1){
          data['doctype'] = "MD"
        }else {
          data['doctype'] = "OD"
        }
        setUser(data);
        return;
      }
      catch(err:any){
        toast.error(`${err.response.message}`);
      }
    }
    
    fetchUser();

  },[])

  const updateUser = async(data:any) => {
    try{
      const response = await api.put(`${Local.EDIT_PROFILE}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    catch(err:any){
      toast.error(`${err.response.data.message}`);
    }
  }

  const updateMutation = useMutation({
    mutationFn: updateUser
  })

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Last Name is required"),
    doctype: Yup.string(),
    email: Yup.string().email(),
    phone: Yup.string().min(10, "Invalid Phone number").required("Phone number is required"),
    dob: Yup.date().max(new Date(), "Don't select future date").required("Date of Birth is required")
  });

  const updateHandler = (values:any) => {
    console.log("Hello");
    console.log(values)
  }


  return (
    <>
    {
      !user ? (<>Loading</>) :
      (<>
        <Formik
    initialValues={{
      firstname: user?.firstname,
      lastname: user?.lastname,
      email:user?.email,
      phone:user?.phone,
      dob:user?.dob,
      doctype:user?.doctype
    }}
    validationSchema={validationSchema}
    onSubmit={updateHandler}>
      {()=> (
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
            <label>Doctor Type:</label>
            <Field type="text" name="doctype" className="form-control" disabled />
          </div>
          <br />

          <div className="form-group">
            <label>Email:</label>
            <Field type="email" name="email" className="form-control" disabled />
          </div>
          <br />

          <div className="form-group">
            <label>Phone:</label>
            <Field type="text" name="phone" maxLength={10} className="form-control" />
            <ErrorMessage name="phone" component="div" className="text-danger" />
          </div>
          <br />

          <div className="form-group">
            <label>Date of Birth:</label>
            <Field type="date" name="dob" className="form-control" />
            <ErrorMessage name="dob" component="div" className="text-danger" />
          </div>


          <button type="submit" className="btn btn-primary">Update</button>
        </Form>
      )}
    </Formik>
      </>)
    }
    
    </>
  )
}

export default UpdateProfile