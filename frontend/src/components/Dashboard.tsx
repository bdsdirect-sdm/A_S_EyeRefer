import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styling/Dashboard.css';
import ref from '../Assets/ref.svg';
import refcom from '../Assets/refcom.svg';
import doc from '../Assets/doc.png'

const Dashboard:React.FC = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token");
    const [page, setPage] = useState<number>(1);
    const [SortBy, setSortBy] = useState('CreatedAt');
    const [SortIn, setSortIn] = useState('DESC');
    const search = '';
    let totalPages:any;
    
    useEffect(()=>{
        if(!token){
            navigate("/login");
        }
    },[]);


    const viewNavigator = (patientUUID:any) => {
        localStorage.setItem("patientId", patientUUID);
        navigate("/view-patient"); 
      }


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
    
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser
    });

    const fetchPatient = async(pageno:any, search:any, SortBy:any, SortIn:any) => {
        try{
          console.log("sortby", SortBy);
          console.log("sortin", SortIn);
          const response = await api.get(`${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`, {
            headers:{
              Authorization: `Bearer ${token}`
            },
            params:{
              sortBy: SortBy,
              sortIn: SortIn
            }
          })
          // console.log("Listing------------------------------------------------>", response.data)
          return response.data;
        }
        catch(err){
            console.log(err);
        }
      }
    
      const { data: patientList, error:patientError, isLoading:patientloading, isError:ispatientError } = useQuery({
        queryKey: ['patient', page, search, SortBy, SortIn],
    queryFn: ()=>fetchPatient(page, search, SortBy, SortIn)
      });

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

    if(isLoading || patientloading ){
        return (
        <>
        <div className='loading-icon'>
            <div className="spinner-border spinner text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className='me-2 fs-2' >Loading...</div>
        </div>
        </>
        )
    }

    if(isError || ispatientError){
        return(
            <>
            <div>Error: {error?.message}</div>
            <div>Error: {patientError?.message}</div>
            </>
        )
    }

    totalPages = Math.ceil(patientList?.totalpatients/10);
    // console.log(totalPages);
    console.log(patientList);
    console.log(data?.data);

  return (
    <div className='dashboard-containe me-3' >
        <div>
            <p >Dashboard</p>

            <div className='d-flex flex-wrap dash-card dash-box justify-content-between' >
                
                <div className='bg-white chng-pointer pt-2 rounded-1' onClick={()=>{
                    navigate('/patient');
                }}>
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${ref}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' > {data?.data.referCount} </h3>
                    </div>
                    <div className='d-flex' >
                        <p className='ms-3 referal-placed fw-bold' >Referrals Placed</p>
                        <p className=' me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

                <div className='bg-white chng-pointer pt-2 rounded-1' onClick={()=>{
                    navigate('/patient');
                }} >
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${refcom}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' > {data?.data.referCompleted} </h3>
                    </div>
                    <div className='d-flex' >
                        <p className='ms-3 referal-placed fw-bold ' >Referrals Completed</p>
                        <p className=' ms-4 me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

                <div className='bg-white chng-pointer pt-2 rounded-1' onClick={()=>{
                    navigate('/doctor');
                }}>
                    <div className='d-flex'>
                        <img  className='ms-3 mt-2 mb-2 dashboard-img p-2 rounded' src={`${doc}`} height={39} alt="rp" />
                        <h3 className='referrals-count mt-2 me-2 ' > {data?.data.docCount} </h3>
                    </div>
                    <div className='d-flex' >

                        {localStorage.getItem('doctype') == '1' &&(
                            <p className='ms-3 referal-placed' >Doctor OD/MD</p>
                        )}
                        {localStorage.getItem('doctype') == '2' &&(
                            <p className='ms-3 referal-placed fw-bold' >Doctor MD</p>
                        )}

                        <p className=' me-2 referal-placed text-secondary referrals-count' >Last update: 20 Aug</p>
                    </div>
                </div>

            </div>
        </div>
        
        <div>
            
            <div className='d-flex  mt-4'>
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
                <table className="table table-hover mt-4 me-3">

                <thead >
                        <tr className='table-head table-secondary ' >
                        <th scope="col">
                          <div className='flex' >
                            <p className='pt-2'> Patient </p> 
                            <div className='pt-2 ps-1' onClick={()=>{
                              setSortBy('firstname');
                              setSortIn(SortIn === 'ASC' ? 'DESC' : 'ASC');
                            }} >

                              {(SortIn ==='DESC' && SortBy==='firstname')?(
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                              )}
                            </div>
                          </div>
                        </th>
                        <th scope="col">
                          <p>
                            DOB
                          </p>
                        </th>
                        <th scope="col"> <p>Disease</p> </th>
                        <th scope="col">
                        <div className='flex' >
                            <p className='pt-2 pe-0 '> Date Sent </p> 
                            <div className='pt-2 ps-1' onClick={()=>{
                              setSortBy('createdAt');
                              setSortIn(SortIn === 'ASC' ? 'DESC' : 'ASC');
                            }} >
                              {(SortIn ==='DESC' && SortBy==='createdAt')?(
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                              )}
                            </div>
                          </div>
                        </th>
                        <th scope="col"> Appointment Date </th>
                        <th scope="col">
                        <div className='flex' >
                            <p className='pt-2 pe-0 '> Refered to </p> 
                            {/* <div className='pt-2 ps-1' onClick={()=>{}} >
                            {(SortIn ==='DESC' && SortBy==='referto')?(
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                              )}
                            </div> */}
                          </div>
                        </th>
                        <th scope="col">
                        <div className='flex' >
                            <p className='pt-2 pe-0 '> Status </p> 
                            <div className='pt-2 ps-1' onClick={()=>{
                              setSortBy('referalstatus');
                              setSortIn(SortIn === 'ASC' ? 'DESC' : 'ASC');
                            }} >
                              {(SortIn ==='DESC' && SortBy==='referalstatus')?(
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                              )}
                            </div>
                          </div>
                        </th>
                        <th scope="col"> <p>Consult Note</p> </th>
                        <th scope="col"> Ready to Return </th>
                        <th scope="col"> Direct Message </th>
                        <th scope="col"> <p>Action</p> </th>
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
                                    <td className='text-success'>Completed</td>
                                ))}
                                {( patient.referalstatus == 0 && (
                                    <td className='text-warning' > Pending </td>
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
                                    <div className='dashboard-eye ms-2 pt-1 rounded-1' onClick={()=>{viewNavigator(patient.uuid)}} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye text-light" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                        </svg>
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

    </div>
  )
}

export default Dashboard