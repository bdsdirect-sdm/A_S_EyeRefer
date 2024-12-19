import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DoctorList:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype = localStorage.getItem('doctype');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [Input, setInput] = useState('');
  const [SortBy, setSortBy] = useState('CreatedAt');
  const [SortIn, setSortIn] = useState('DESC');
  let totalPages;

  useEffect(()=>{
    if(!localStorage.getItem("doctype")){
      navigate("/login");
    }
  },[]);

  const fetchDoctors = async(page:any, search:any, sortBy:any, sortIn:any) => {
    try{
      const response = await api.get(`${Local.GET_DOC_LIST}?page=${page}&limit=10&find=${search}`, {
        headers:{
          Authorization: `Bearer ${token}`
        },
        params:{
          sortBy: sortBy,
          sortIn: sortIn
        }
      })
      setInput('');
      return response.data;
    }
    catch(err){
      toast.error(`${err}`);
    }
  }
 
  const { data: Doctors, error, isLoading, isError } = useQuery({
    queryKey: ['doctor', page, search, SortBy, SortIn],
    queryFn: ()=>fetchDoctors(page, search, SortBy, SortIn)
  })

  if(isLoading){
    return(
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )}

  if(isError){
    return(
      <>
      <div className='text-danger' >Error: {error.message}</div>
      </>
      )}

      totalPages = Math.ceil(Doctors?.totaldocs/10);
      console.log("---------->", Doctors);

  return (
    <>
    {(doctype == '1')&& (
      <h5 className='mb-3 mt-2' >MD/OD</h5>
    )}
    {(doctype == '2')&& (
      <h5 className='mb-3 mt-2' >MD</h5>
      )}
      

    <div className=' d-flex bg-white' >
      <h6 className='bg-white pt-4 px-4 '>Doctor</h6>
      <div className='d-flex ms-auto' >
        <input className='form-control w-75 border border-secondary-subtle mx-4 mt-3 p-2 mb-3' type="search" name="find" placeholder='Search' value={Input} onChange={(e:any)=>{setInput(e.target.value)}} />
        {(Input.length !=0) && (

          <button className='btn btn-outline-dark mt-3 mb-3 me-2' type="submit" 
          onClick={(e:any)=>{
            setSearch(Input);
            setPage(1);
            e.preventDefault();
          }}
          >Search</button>
        )}
      </div>
    </div>
    <table className="table table-hover">
  <thead>
    <tr className='table-secondary' >
      <th scope="col">
        <div className='flex ms-4' >
          <p className='pt-2 pe-0 '> Doctor Name </p> 
          <div className='pt-2 ps-1' onClick={()=>{
            setSortBy('firstname');
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
      <th scope="col"> <p>Referral Placed</p> </th>
      <th scope="col"> <p>Referral Completed</p> </th>
      <th scope="col"> <p>Avg. Time Of Contact</p> </th>
      <th scope="col"> <p>Avg. Time Of Consultation</p> </th>
      <th scope="col"> <p>Phone</p> </th>
      <th scope="col"> <p>Email</p> </th>
      <th scope="col"> <p>Type</p> </th>
      {/* <th scope="col"> Action </th> */}
    </tr>
  </thead>
  <tbody>
    {Doctors.docList.map((doctor:any) =>(
      <>
      {doctor && (
        <>
          <tr key={doctor.uuid} >
            <td>{doctor.firstname} {doctor.lastname}</td>
            <td> {doctor.totalreferalreceive} </td>
            <td> {doctor.totalreferalcompleted} </td>
            <td> -- </td>
            <td> -- </td>
            {(doctor.phone) && (<td>{doctor.phone}</td>)}
            {(!doctor.phone) && (<td> -- </td>)}
            <td> {doctor.email} </td>
            <td> {doctor.doctype==1 && ("MD")} {doctor.doctype==2 && ("OD")} </td>
            {/* <td>F</td> */}

          </tr>
        </>
      )}
      </>
    ))}
  </tbody>
</table>
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
    </>
  )
}

export default DoctorList
