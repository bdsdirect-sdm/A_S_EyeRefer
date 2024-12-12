import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import socket from '../socket/socketConn';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const addPatient = async (data: any) => {
    console.log("Data for API", data);
    try {
      const response = await api.post(`${Local.ADD_PATIENT}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Patient referred successfully");
      socket.emit('sendNotification', {'pId':response.data.patient.uuid, 'code':2} );
      navigate('/patient');
      return;
    } catch (err: any) {
      toast.error(`${err.response?.data?.message || 'Error occurred'}`);
      return;
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    if (localStorage.getItem("doctype") === '1') navigate('/dashboard');
  }, [navigate, token]);

  const fetchDocs = async () => {
    try {
      const response = await api.get(`${Local.GET_DOC_LIST}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Data---->", response.data);
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching doctor list');
    }
  };

  const { data: MDList, isLoading, isError, error } = useQuery({
    queryKey: ["MDList"],
    queryFn: fetchDocs,
  });

  const patientMutate = useMutation({
    mutationFn: addPatient
  });

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    disease: Yup.string().required("Disease is required"),
    laterality: Yup.string().required("laterality is required"),
    timing: Yup.string().required("Timing is required"),
    company: Yup.string().required("Company name is reuired"),
    starting_date: Yup.date().max(new Date, "Invalid Date").required("Starting Date is required"),
    expiry_date: Yup.date().min(new Date, "Invalid Date").required("Exipry Date is required"),
    document: Yup.mixed().notRequired(),
    note: Yup.string().notRequired(),
    referedto: Yup.string().required("Select Doctor"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    dob: Yup.date().max(new Date, "Invalid Date of Birth").required('Date of Birth is Required'),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    phone: Yup.string().required("Phone is required").matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    referback: Yup.string()
  });

  const referPatientHandler = (values: any) => {
    const data = {
      "firstname": values.firstname,
      "lastname": values.lastname,
      "disease": values.disease,
      'email': values.email,
      'referback': values.referback,
      "referedto": values.referedto,
      'address': values.address
    }
    // console.log(data);
    patientMutate.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>Error: {error?.message || 'Error loading data'}</div>
    );
  }

  return (
    <div>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          disease: '',
          laterality: '',
          timing: '',
          company: '',
          starting_date: '',
          expiry_date: '',
          document: null,
          note: '',
          referedto: '',
          gender: '',
          address: '',
          dob: '',
          email: '',
          phone: '',
          referback: 0
        }}
        validationSchema={validationSchema}
        onSubmit={referPatientHandler}
      >
        {({ values, setFieldValue }) => (
          <Form>

            <div className='bg-white' >
              
              <div className='mb-5' >

                <div className='d-flex justify-content-around py-4' >
                  <div className='w-25' >
                    <label htmlFor="dob">Date of Birth</label>
                    <Field name='dob' type='date' placeholder='Enter DOB' className='form-control' />
                    <ErrorMessage name='dob' component='div' className='text-danger' />
                  </div>

                  <div className='w-25' >
                    <label htmlFor="email\">Email</label>
                    <Field name='email' type='email' placeholder='Enter email address' className='form-control' />
                    <ErrorMessage name='email' component='div' className='text-danger' />
                  </div>

                  <div className='w-25' >
                    <label htmlFor="phone">Phone Number</label>
                    <Field name='phone' type='text' placeholder='Enter phone number' maxLength={10} className='form-control' />
                    <ErrorMessage name='phone' component='div' className='text-danger' />
                  </div>

                </div>

                <div className='d-flex justify-content-around' >
                  <div className='w-25' >
                    <label htmlFor="firstname">First Name</label>
                    <Field name='firstname' type='text' placeholder='Enter First Name' className='form-control' />
                    <ErrorMessage name='firstname' component='div' className='text-danger'/>
                  </div>
                  <div className='w-25' >
                    <label htmlFor="lastname">Last Name</label>
                    <Field name='lastname' type='text' placeholder='Enter Last Name' className='form-control' />
                    <ErrorMessage name='lastname' component='div' className='text-danger'/>
                  </div>
                  <div className='w-25' >
                    <label htmlFor="gender">Gender</label>
                    <Field as='select' name='gender' className='form-control' >
                      <option value="" defaultChecked disabled>Choose Gender</option>
                      <option value="Male" > Male </option>
                      <option value="Female" > Female </option>
                      <option value="Others" > Others </option>
                    </Field>
                    <ErrorMessage name='gender' component='div' className='text-danger'/>
                  </div>

                </div>

              </div>
              
              <div className='mb-5' >
                <h5 className='ms-4' >Reason of Consult</h5>
                
                <div className='my-3' >
                  <div className='d-flex justify-content-around' >

                    <div className="form-group w-25">
                      <label>Reason</label>
                      <Field as='select' name='disease' className='form-select'>
                        <option value="" disabled>Choose Disease</option>
                        {['Disease 1', 'Disease 2', 'Disease 3', 'Disease 4', 'Disease 5'].map(disease => (
                          <option key={disease} value={disease}>{disease}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="disease" component="div" className="text-danger" />
                    </div>

                    <div className="form-group w-25">
                      <label>Laterality</label>
                      <Field as='select' name='laterality' className='form-select'>
                        <option value="" disabled>Choose laterality</option>
                        {['Left', 'Right', 'Both'].map(laterality => (
                          <option key={laterality} value={laterality}>{laterality}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="laterality" component="div" className="text-danger" />
                    </div>
                    
                    <div className="form-check form-switch">
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckChecked"
                        >
                        Patient to return to your care afterwards
                      </label>
                      <div className='d-flex' >
                        <span className='text-secondary mx-2' >no</span>
                        <Field
                          type="checkbox"
                          name="referback"
                          className="form-check-input py-2 ms-1"
                          id="flexSwitchCheckChecked"
                          onChange={(e:any) => setFieldValue("referback", e.target.checked)}/> 
                        <span className='text-secondary mx-2 ' >yes</span>
                      </div>
                        <ErrorMessage
                          name="referback"
                          component="div"
                          className="text-danger"
                        />
                    </div>

                  </div>

                  <div>
                    <div className="form-group w-25 ms-4">
                      <label>Timing</label>
                      <Field as='select' name='timing' className='form-select'>
                        <option value="" defaultChecked disabled>Select</option>
                        {['Routine (Within 1 Month)', 'Urgent (Within 1 week)', 'Emergent (Within 24 hours or less)'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="timing" component="div" className="text-danger" />
                    </div>
                  </div>
                  
                </div>

              </div>

              <div className='mb-5' >
                <h5 className='ms-4' > Referral MD </h5>
                
                <div className='row justify-content-evenly d-flex mx-3' >

                  <div className="form-group w-25 col ">
                    <label>Doctor:</label>
                    <Field as='select' name='referedto' className='form-select'>
                      <option value="" disabled>Choose Doctor</option>
                      {MDList?.docList?.map((md: any) => (
                        <option key={md.uuid} value={md.uuid}>{md.firstname} {md.lastname}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="referedto" component="div" className="text-danger" />
                  </div>

                  <div className='w-25 col' >
                    <label>Address:</label>
                    <Field as='select' name='address' className='form-select'>
                      <option value="" defaultChecked disabled> Choose Address </option>
                      {values.referedto && MDList.docList.find((md:any)=>md.uuid === values.referedto)?.Addresses.map((address:any)=>(
                        <option key={address.uuid} value={address.uuid}>{address.street} {address.district} {address.city} {address.state}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </div>
                  
                </div>
              
              </div>

              <div className='mb-5' >
                <h5 className='ms-4' >Insurance Details</h5>
                
                <div className='row justify-content-evenly d-flex mx-3' >
                  <div className="form-group w-25 col">
                    <label>Company</label>
                    <Field as='select' name='company' className='form-select'>
                      <option value="" disabled>Choose Company</option>
                      {['INS-A', 'INS-B', 'INS-C', 'INS-D', 'INS-E'].map(company => (
                      <option key={company} value={company}>{company}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="company" component="div" className="text-danger" />
                  </div>

                  <div className="form-group w-25 col">
                    <label>Policy Start Date</label>
                    <Field type='date' name='starting_date' className='form-control' />
                    <ErrorMessage name="starting_date" component="div" className="text-danger" />
                  </div>
                  
                  <div className="form-group w-25 col">
                    <label>Policy Expiry Date</label>
                    <Field type='date' name='expiry_date' className='form-control' />
                    <ErrorMessage name="expiry_date" component="div" className="text-danger" />
                  </div>

                </div>
              </div>

              <div className='mb-5' >
                <h5 className='ms-4' >Documentation</h5>
                
                <div className='mx-3 row ' >
                  <div className='w-25 col ' >
                    <label htmlFor="document"> Upload Medical Document </label>
                    <input type="file" id="document" name="document" className="form-control"
                    onChange={(e:any) => setFieldValue('document', e.target.files[0]) } />
                  </div>
                </div>

              </div>

              <div className='mb-3' >
                <div className='mx-4' >
                  <label htmlFor="note">Note</label>
                  <textarea id="note" name="note" className="form-control" placeholder='Type here' rows={3}
                  onChange={(e:any) => setFieldValue('note', e.target.value)} />
                </div>
              </div>

              <div className='d-flex mx-4 ' >
                <button type="submit" className='btn btn-info mx-2 px-4 text-white ' >Submit</button>
                <button type="button" className='btn btn-outline-success mx-2 px-4' onClick={()=>{
                  navigate('/dashboard')
                }} >Cancel</button>
              
              </div>
              <br /><br />
            </div>
            <br /><br /><br /><br /><br />
          </Form>
        )}
      </Formik> 
    </div>
  );
};

export default AddPatient;
