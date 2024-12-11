import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const AddStaff:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(()=>{
    if(!token){
      navigate('/login');
    }    
  },[]);

  const addStaff = async(data:any) =>{
    try{
      const response = await api.post(`${Local.ADD_STAFF}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      navigate('/staff');
      return;
    }
    catch(err:any){
      toast.error(err.response.data.message);
      return;
    }
  }

  const addStaffMutation = useMutation({
    mutationFn: addStaff
  })

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("firstname is required"),
    lastname: Yup.string().required("lastname is required"),
    gender: Yup.string().required("gender is required"),
    email: Yup.string().email("Invalid email").required("email is required"),
    phone: Yup.string().required("phone is required").matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  });

  const submitHandler = (values:any) => {
    // console.log(values);
    addStaffMutation.mutate(values);
  }


  return ( 
    <div>
      <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        gender: '',
        email: '',
        phone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={submitHandler}>
          {()=>(
            <>
              <h5 className='mb-3' > Add Staff</h5>
              <div className='bg-white p-5 mb-5 rounded' >
                <Form>
                  <div className="form-group">
                    <label>First Name</label>
                    <Field type="text" name="firstname" placeholder="Enter First Name" className='form-control' />
                    <ErrorMessage name="firstname" component="div" className="text-danger" />
                  </div>
                  <br />

                  <div className="form-group">
                    <label>Last Name</label>
                    <Field type="text" name="lastname" placeholder="Enter Last Name" className='form-control' />
                    <ErrorMessage name="lastname" component="div" className="text-danger" />
                  </div>
                  <br />

                  <div className="form-group">
                    <label>Gender</label>
                    <Field as="select" name="gender" className='form-control'>
                      <option value="" defaultChecked disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-danger" />
                  </div>
                  <br />

                  <div className="form-group">
                    <label>Email</label>
                    <Field type="email" name="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>
                  <br />

                  <div className="form-group">
                    <label>Phone:</label>
                    <Field type="text" name="phone" maxLength={10} className="form-control" />
                    <ErrorMessage name="phone" component="div" className="text-danger" />
                  </div>

                  <button type="submit" className='btn btn-primary px-5 py-2 mt-3' >Add Staff</button>
                  <br /><br />

                </Form>
              </div>
            </>
          )}
      </Formik>
    </div>
  )
}

export default AddStaff