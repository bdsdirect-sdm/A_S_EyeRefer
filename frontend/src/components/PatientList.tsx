import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { queryClient } from '../main';

const PatientList:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype = localStorage.getItem("doctype");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [Input, setInput] = useState('');
  let totalPages;

  useEffect(()=>{
    if(!token){
      navigate('/login');
    }

  },[]);
  

  const viewNavigator = (patientUUID:any) => {
    localStorage.setItem("patientId", patientUUID);
    navigate("/view-patient"); 
  }

  const updateNavigator = (patientUUID:any) => {
    localStorage.setItem("patientId", patientUUID);
    navigate("/update-patient");
  }

  // const deletePatient = async(patientUUID:any) => {
  //   try{
  //     const response = await api.delete(`${Local.DELETE_PATIENT}/${patientUUID}?page=${page}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     queryClient.invalidateQueries({ queryKey: ['patient'] });
  //     toast.success(response.data.message);

  //   }
  //   catch(err:any){
  //     toast.error(err.response.data.message);
  //   }
  // }

  const fetchPatient = async(pageno:any, search:any) => {
    try{
      const response = await api.get(`${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      // console.log("Listing------------------------------------------------>", response.data)
      setInput('');
      return response.data;
    }
    catch(err){
      toast.error(`${err}`);
    }
  }
 
  const { data: patientList, error, isLoading, isError } = useQuery({
    queryKey: ['patient', page, search],
    queryFn: ()=>fetchPatient(page, search)
  })

  const getUser = async() => {
    try{
        console.log("Hello")
        const response = await api.get(`${Local.GET_USER}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        // console.log("Response-------->", response);
        return response;
    }
    catch(err){
        console.log("Error-------->", err);
        return;
    }
}

const { data, isError:isUserError, error:userError, isLoading:userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser
});

  if(isLoading || userLoading){
    return(
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )}

  if(isError || isUserError){
    return(
      <>
      <div className='text-danger' >Error: {error?.message} {userError?.message} </div>
      </>
      )}
  const directChat = (patient:any, user1:any, user2:any, user:any, firstname:any, lastname:any) => {
    const chatdata = {
        patient: patient,
        user1: user1,
        user2: user2,
        user:user,
        roomname: `${firstname} ${lastname}`
    };
    localStorage.setItem("pname", chatdata.roomname);
    localStorage.setItem('chatdata', JSON.stringify(chatdata));
    navigate('/chat')
    return;
  }

  totalPages = Math.ceil(patientList?.totalpatients/10);

  return (
    <>
          <div>
            
            <div className='d-flex '>
                <h5 className='mt-2' > Referral Patient </h5>
                {localStorage.getItem('doctype') == '2' && (
                    <button type="button" className=' add-refer-btn text-white btn' onClick={()=>{
                        navigate('/add-patient');
                    }} >+ Add Referral Patient </button>
                )}
                {localStorage.getItem('doctype') == '1' && (
                    <button type="button" className=' add-refer-btn text-white btn' onClick={()=>{
                        navigate('/add-appointment');
                    }} >+ Add Appointment </button>
                )}

            </div>
            
            <div>
              <div className='d-flex' >
                <input className='form-control w-25 border border-dark me-3 mt-5 mb-2'  type="search" name="find" value={Input} placeholder='Search' onChange={(e:any)=>{setInput(e.target.value)}} />
                {(Input.length != 0 && (
                  <button className='btn btn-outline-dark mb-2 mt-5' type="submit" 
                  onClick={(e:any)=>{
                    setSearch(Input);
                    setPage(1);
                    e.preventDefault();
                  }}
                  >Search</button>
                ))}
              </div>

                <table className="table table-hover mt-4 me-3">
                    <thead >
                        <tr className='table-head table-secondary ' >
                        <th scope="col"> Patient Name </th>
                        <th scope="col"> DOB </th>
                        <th scope="col"> Disease </th>
                        <th scope="col"> Date Sent </th>
                        <th scope="col"> Appointment Date </th>
                        <th scope="col"> Refered to </th>
                        <th scope="col"> Status </th>
                        <th scope="col"> Consult Note </th>
                        <th scope="col"> Ready to Return </th>
                        <th scope="col"> Direct Message </th>
                        <th scope="col"> Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientList.patientList.map((patient:any)=>(
                            <>
                            <tr key={patient.uuid}>
                                <td> {patient.firstname} {patient.lastnamme} </td>
                                <td> Nov-21-2024 </td>
                                <td> {patient.disease} </td>
                                <td> Nov-11-2024 </td>
                                {(patient.patientId != null && (
                                    <td> {patient.patientId.date} </td>
                                ))}
                                {(patient.patientId == null && (
                                    <td> -- </td>
                                ))}
                                <td> {patient.referedto.firstname} {patient.referedto.lastname} </td>
                                {( patient.referalstatus == 1 && (
                                    <td>fff</td>
                                ))}
                                {( patient.referalstatus == 0 && (
                                    <td>ss</td>
                                ))}
                                {( patient.referalstatus == 3 && (
                                    <td>ddd</td>
                                ))}

                                <td> <Link to="#" onClick={()=>{alert("Under Process")}} >Yes</Link> </td>
                                {patient.referback && (
                                    <td>Yes</td>
                                )}
                                {patient.referback==false && (
                                    <td>No</td>
                                )}
                                <td> <p className = 'text-primary text-decoration-underline chng-pointer' onClick={()=>{
                                    directChat(patient.uuid, patient.referedby.uuid, patient.referedto.uuid, data?.data.user.uuid, patient.firstname, patient.lastname);
                                }} >Link</p> </td>
                                <td>
                                  <div className='d-flex' >

                                    <div className='dashboard-eye ms-2 pt-1 rounded-1' onClick={()=>{viewNavigator(patient.uuid)}} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye text-light" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                        </svg>
                                      </div>

                                        { doctype == '2' &&
                                        // (patient.isseen==true) &&     // Pending (Hide edit and delete after appointment is made)
                                        (
                                          <>
                                          <div className='bg-secondary-subtle ms-3 p-1 px-2 rounded-1' onClick={()=>{updateNavigator(patient.uuid)}} >

                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-plus text-primary" viewBox="0 0 16 16">
                                              <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/>
                                              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                                            </svg>
                                          </div>

                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16" onClick={()=>{deletePatient(patient.uuid)}} >
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg> */}

                                          </>
                                        )}
                                        </div>
                                </td>
                                    
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            { totalPages > 1 && (
                <>
                    <div className='float-end bg-white pagi-width rounded'>
                        <div className='p-1 d-flex'>
                            <button className=' pb-2 pt-1 btn btn-white border-0' onClick={()=>{setPage(1)
                            }} disabled={page<2?true:false}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                                </svg>
                            </button>
                            <button className=' pb-2 pt-1 btn border-0 btn-white' onClick={()=>{setPage((prev)=>prev-1)
                            }} disabled={page<2?true:false}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                                </svg>
                            </button>
                            <button className=' pb-2 pt-1 btn border-0 btn-white' onClick={()=>{setPage(1)
                            }} disabled={page==1?true:false}>
                                1
                            </button>
                            <button className=' pb-2 pt-1 btn border-0 btn-white' onClick={()=>{setPage(2)
                            }} disabled={page==2?true:false}>
                                2
                            </button>
                            <button className=' pb-2 pt-1 btn border-0 btn-white' onClick={()=>{setPage(3)
                            }} disabled={page==3?true:false}>
                                3
                            </button>
                            <div className=' pb-2 pt-1 px-2 btn btn-white '>
                                ...
                            </div>
                            <button className=' pb-2 pt-1 btn border-0 btn-white' onClick={()=>{setPage((prev)=>prev+1)
                            }} disabled={page>=totalPages?true:false}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                            </button>
                            <button className=' pb-2 pt-1 btn border-0 btn-white' onClick={()=>{setPage(totalPages)
                            }} disabled={page>=totalPages?true:false}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
                                    <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                            </button>

                        </div>
                    </div>
                    <br /><br /><br />
                </>
            ) }
        
        </div>

    </>
  )
}

export default PatientList
