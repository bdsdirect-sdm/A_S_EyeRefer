import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Profile</h1>
        
      </div>

      <div className="mb-4">
        <div>
          <strong>Name: </strong> {User.user.firstname} {User.user.lastname}
        </div>
        <div>
          <strong>Phone: </strong> {User.user.phone == null ? <span className="text-muted">Null</span> : User.user.phone}
        </div>
        <div>
          <strong>Email: </strong> {User.user.email}
        </div>
        <div>
          <strong>DOB: </strong> {User.user.dob == null ? <span className="text-muted">Null</span> : User.user.dob}
        </div>
        <div>
          <strong>Doctor Type: </strong> 
          {User.user.doctype === 1 ? "MD" : User.user.doctype === 2 ? "OD" : "Unknown"}
        </div>
        <br />

        <div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h2>Address</h2>
        {User.user.Addresses.length > 0 ? (
          User.user.Addresses.map((address: any, index: number) => (
            <>
            <div key={index} className="card mb-3">
              <div className="card-body">
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>District:</strong> {address.district}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Street:</strong> {address.street}</p>
                <p><strong>Office Phone:</strong> {address.phone}</p>
                <p><strong>PinCode:</strong> {address.pincode}</p>
              </div>
            </div>
            </>
          ))
        ) : (
          <>
          <div>No addresses available.</div>
            </>
        )}
        <div>
              <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => navigate("/add-address")}
          >
          Add Address
        </button>
          </div>
      </div>
    </div>
  );
}

export default Profile;
