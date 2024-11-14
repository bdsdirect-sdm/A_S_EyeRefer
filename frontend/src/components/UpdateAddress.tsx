import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { queryClient } from '../main';
import * as Yup from 'yup';

const UpdateAddress:React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const  address:any = JSON.parse(localStorage.getItem("address") || '{"address":"None"}');
    console.log("Address", address);

    useEffect(()=>{
        if(!token){
            navigate('/login');
            }
        if(address.address){
            navigate('/profile');
        }
        return ()=>{
            localStorage.removeItem('address');
        }
    },[]);
    
    const updateAddress = async(data:any) => {
        try{
            const response = await api.put(`${Local.EDIT_ADDRESS}/${address.uuid}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response.data.message);
            queryClient.invalidateQueries({
                queryKey:['dashboard']
            })
            return response.data;
        }
        catch(err:any){
            toast.error(err.response.data.message);
        }
    }


    const addressMutation = useMutation({
        mutationFn: updateAddress
    })


    const validationSchema = Yup.object().shape({
        state: Yup.string().required('State is required'),
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        district: Yup.string().required('District is required'),
        phone: Yup.string().required('Phone is required'),
        pincode: Yup.number().required('Pincode is required'),
    })

    const updateHandler = (values:any) => {
        addressMutation.mutate(values);
        navigate('/profile');
    }

  return (
    <Formik
    initialValues={{
        state: address.state,
        street: address.street,
        city: address.city,
        district: address.district,
        phone: address.phone,
        pincode: address.pincode,
    }}
    validationSchema={validationSchema}
    onSubmit={updateHandler}

    >
        {()=>(
            <Form>
                <div className="form-group">
                    <label>State</label>
                    <Field type="text" name="state" className="form-control" />
                    <ErrorMessage name="state" component="div" className="text-danger" />
                </div>
                <br />

                <div className="form-group">
                    <label>Street</label>
                    <Field type="text" name="street" className="form-control" />
                    <ErrorMessage name="street" component="div" className="text-danger" />
                </div>
                <br />

                <div className="form-group">
                    <label>City</label>
                    <Field type="text" name="city" className="form-control" />
                    <ErrorMessage name="city" component="div" className="text-danger" />
                </div>
                <br />

                <div className="form-group">
                    <label>District</label>
                    <Field type="text" name="district" className="form-control" />
                    <ErrorMessage name="district" component="div" className="text-danger" />
                </div>
                <br />

                <div className="form-group">
                    <label>Phone</label>
                    <Field type="text" name="phone" className="form-control" />
                    <ErrorMessage name="phone" component="div" className="text-danger" />
                </div>
                <br />

                <div className="form-group">
                    <label>Pincode</label>
                    <Field type="number" name="pincode" className="form-control" />
                    <ErrorMessage name="pincode" component="div" className="text-danger" />
                </div>
                <br />

                <button type="submit" className="btn btn-primary">Update</button>

            </Form>
        )}
    </Formik>
  )
}

export default UpdateAddress