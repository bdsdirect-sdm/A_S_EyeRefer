import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { queryClient } from '../main';
import { toast } from 'react-toastify';

// interface Address{
//   uuid: string;
//   street: string;
//   city: string;
//   createAt: Date;
//   district: string;
//   phone: string;
//   pincode: number;
//   state: string;
//   updatedAt: Date;
//   user: string;
// }

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    
  }, []);

  const deleteHandler = async (addressId:any) => {
    try{
      const response = await api.delete(`${Local.DELETE_ADDRESS}/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      queryClient.invalidateQueries({ queryKey:["dashboard"] });
      toast.success(response.data.message);
      return;
    }
    catch(err:any){
      toast.error(err.response.data.message);
    }
  }
  
  const getUser = async () => {
    try {
      const response = await api.get(`${Local.GET_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      console.log("Error-------->", err);
    }
  }

  const { data: User, isError, error, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getUser
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <>
    <div>
      <h5>Profile</h5>

      <div className='p-4 bg-white mb-5 rounded'>

        <div className='row mb-3'>
          <div className='d-flex col-10'>
            <img src="https://via.placeholder.com/40" alt="User Profile"
            className="rounded-circle me-2" height="80" width="80" />

            <div className='ms-3'>
              <p className='mb-0 mt-3' > Dr. {User.user.firstname} {User.user.lastname} </p>
              <span className='text-secondary mt-0' >Something</span>
            </div>
          </div>

          <div className='col-2'>
            <button className='btn btn-info text-white px-4 py-2' onClick={()=> {
              navigate('/edit-profile')
            }} >Edit Profile</button>
          </div>

          <div></div>
        </div>

        <div className='bg-secondary-subtle rounded mt-3 p-4' >
          <div className='row mb-2'>
            <div className='col'>
              <b>Name: </b> <span> {User.user.firstname} </span>
            </div>
            <div className='col'>
              <b>Gender: </b> <span> Male </span>
            </div>
            <div className='col' />
          </div>

          <div className='row mb-2'>
            <div className='col'>
              <b>Speciality: </b> <span> Sab Kuch </span>
            </div>
            <div className='col'>
              <b>Phone: </b> <span> {User.user.phone} </span>
            </div>
            <div className='col'>
              <b>Email: </b> <span> {User.user.email} </span>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <b>Location: </b> <span> Ram lal Aankho wala.</span>
            </div>
            <div className='col'>
              <span> <Link to={'/profile'} >Insurance List</Link> </span>
            </div>
            <div className='col' />
          </div>

          
        </div>

        <div className='row mt-5 mb-3'>
            <h5 className='col-9'>Address Infomarion</h5>
            <button className='col-2 ms-5 btn btn-outline-info' onClick={()=>{
              navigate('/add-address')
            }} >Add Address</button>
          </div>
        {User.user.Addresses.map((address:any)=>(
          <>
          <div className='bg-secondary-subtle rounded mt-3 p-4' >
          

          <div className='row mb-2'>
            <div className='col'>
              <b>Street: </b> <span> {address.street} </span>
            </div>
            <div className='col'>
              <b>District: </b> <span> {address.district} </span>
            </div>
            <div className='col'>
              <b>City: </b> <span> {address.city} </span>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <b>State: </b> <span> {address.state} </span>
            </div>

            <div className='col'>
              <b>Pincode: </b> <span> {address.pincode} </span>
            </div>

            <div className='col' />
          </div>

          <div className='text-center mt-4'>
            <button className='btn btn-primary mx-2 px-5' onClick={()=>{
              localStorage.setItem("address", JSON.stringify(address));
              navigate('/edit-address')
            }} >Edit</button>
            <button className='btn btn-outline-primary mx-2 px-5' onClick={()=>{
              deleteHandler(address.uuid)
            }} >Delete</button>
          </div>
        </div>
          </>
        ))}
      
      </div>

    </div>
    </>
  );
}

export default Profile;
