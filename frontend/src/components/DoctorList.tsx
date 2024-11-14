import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DoctorList:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [Input, setInput] = useState('');
  let totalPages;

  useEffect(()=>{
    if(!localStorage.getItem("doctype")){
      navigate("/login");
    }
  },[]);

  const fetchDoctors = async(page:any, search:any) => {
    try{
      const response = await api.get(`${Local.GET_DOC_LIST}?page=${page}&limit=10&find=${search}`, {
        headers:{
          Authorization: `Bearer ${token}`
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
    queryKey: ['doctor', page, search],
    queryFn: ()=>fetchDoctors(page, search)
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
    <div className='d-flex' >
      <input className='form-control w-25 border border-dark mx-3 mb-5' type="search" name="find" value={Input} onChange={(e:any)=>{setInput(e.target.value)}} />
      <button className='btn btn-outline-dark mb-5' type="submit" 
        onClick={(e:any)=>{
        setSearch(Input);
        setPage(1);
        e.preventDefault();
        }}
        >Search</button>
    </div>
    <hr />

    <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col"> Name </th>
      <th scope="col"> email </th>
      <th scope="col"> Doctor Type </th>
    </tr>
  </thead>
  <tbody>
    {Doctors.docList.map((doctor:any,index:number) =>(
      <>
      <tr key={index} >
        <td className='fw-bold' > {index+1} </td>
        <td>{doctor.firstname} {doctor.lastname}</td>
        <td> {doctor.email} </td>
        <td> {doctor.doctype==1 && ("MD")} {doctor.doctype==2 && ("OD")} </td>

      </tr>
      </>
    ))}
  </tbody>
</table>
<button className='btn btn-outline-dark mx-3' onClick={()=>{setPage((prev)=>prev-1)
}} disabled={page==1?true:false} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
</svg> Prev</button>

<button className='btn btn-outline-dark mx-3' onClick={()=>{setPage((prev)=>prev+1)
}} disabled={page==totalPages?true:false}
 >Next <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
</svg></button>
    </>
  )
}

export default DoctorList
