// import React, { useState, useEffect } from 'react';
// import api from '../api/axiosInstance';  // Assuming this is your Axios instance
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import './Staff.css';  // Add custom styles if needed

// const Staff: React.FC = () => {
//   const navigate = useNavigate();

//   // State variables for form fields
//   const [staffName, setStaffName] = useState('');
//   const [email, setEmail] = useState('');
//   const [contact, setContact] = useState('');
//   const [gender, setGender] = useState('Male');
//   const [loading, setLoading] = useState(false);  // Loading state for the button
//   const [staffList, setStaffList] = useState<any[]>([]);  // State to store the list of staff

//   // Fetch the staff list from the API
//   const fetchStaffList = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Please log in to view staff.');
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await api.get('/staff-list', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         setStaffList(response.data.staff);  // Assuming the staff list is returned as an array
//       } else {
//         toast.error(response.data.message || 'Failed to fetch staff list');
//       }
//     } catch (err: any) {
//       toast.error(`Error: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   // Call the fetchStaffList function on component mount
//   useEffect(() => {
//     fetchStaffList();
//   }, []);

//   // Function to handle adding staff
//   const handleAddStaff = async (e: React.FormEvent) => {
//     e.preventDefault();  // Prevent default form submission

//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Please log in to add staff.');
//       navigate('/login');
//       return;
//     }

//     const staffData = {
//       staffName,
//       email,
//       contact,
//       gender,
//     };

//     try {
//       setLoading(true);  // Show loading indicator
//       const response = await api.post('/add-Staff', staffData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         toast.success('Staff added successfully');
//         // Reset form fields
//         setStaffName('');
//         setEmail('');
//         setContact('');
//         setGender('Male');
//         // Fetch the updated staff list
//         fetchStaffList();
//       } else {
//         toast.error(response.data.message || 'Failed to add staff');
//       }
//     } catch (err: any) {
//       toast.error(`Error: ${err.response?.data?.message || err.message}`);
//     } finally {
//       setLoading(false);  // Hide loading indicator
//     }
//   };

//   return (
//     <div className="staff-form-container">
//       <h3>Add Staff</h3>
//       <form onSubmit={handleAddStaff}>
//         <div className="form-group">
//           <label htmlFor="staffName">Staff Name</label>
//           <input
//             type="text"
//             id="staffName"
//             className="form-control"
//             value={staffName}
//             onChange={(e) => setStaffName(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             className="form-control"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="contact">Contact</label>
//           <input
//             type="text"
//             id="contact"
//             className="form-control"
//             value={contact}
//             onChange={(e) => setContact(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="gender">Gender</label>
//           <select
//             id="gender"
//             className="form-control"
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//             required
//           >
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary"
//           disabled={loading} // Disable button during loading
//         >
//           {loading ? 'Adding Staff...' : 'Add Staff'}
//         </button>
//       </form>

//       <h3>Staff List</h3>
//       <div className="staff-list">
//         {staffList.length === 0 ? (
//           <p>No staff members found.</p>
//         ) : (
//           <ul>
//             {staffList.map((staff: any) => (
//               <li key={staff.id}>
//                 {staff.staffName} - {staff.email} - {staff.contact} - {staff.gender}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Staff;
////////////////////////////////////////////////////////
import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';  // Assuming this is your Axios instance
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Staff.css';  // Add custom styles if needed

const Staff: React.FC = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);  // Loading state for the button
  const [staffList, setStaffList] = useState<any[]>([]);  // State to store the list of staff

  // Fetch the staff list from the API
  const fetchStaffList = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to view staff.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.get('/staff-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStaffList(response.data.staff);  // Assuming the staff list is returned as an array
      } else {
        toast.error(response.data.message || 'Failed to fetch staff list');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // Call the fetchStaffList function on component mount
  useEffect(() => {
    fetchStaffList();
  }, []);

  // Function to handle adding staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to add staff.');
      navigate('/login');
      return;
    }

    const staffData = {
      staffName,
      email,
      contact,
      gender,
    };

    try {
      setLoading(true);  // Show loading indicator
      const response = await api.post('/add-Staff', staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Staff added successfully');
        // Reset form fields
        setStaffName('');
        setEmail('');
        setContact('');
        setGender('Male');
        // Fetch the updated staff list
        fetchStaffList();
      } else {
        toast.error(response.data.message || 'Failed to add staff');
      }
    } catch (err: any) {
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  return (
    <div className="staff-form-container">
      <h3>Add Staff</h3>
      <form onSubmit={handleAddStaff} className="staff-form">
        <div className="form-group">
          <label htmlFor="staffName">Staff Name</label>
          <input
            type="text"
            id="staffName"
            className="form-control"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            id="contact"
            className="form-control"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading} // Disable button during loading
        >
          {loading ? 'Adding Staff...' : 'Add Staff'}
        </button>
      </form>

      <h3>Staff List</h3>
      <div className="staff-list">
        {staffList.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff: any) => (
                <tr key={staff.id}>
                  <td>{staff.staffName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.contact}</td>
                  <td>{staff.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Staff;
