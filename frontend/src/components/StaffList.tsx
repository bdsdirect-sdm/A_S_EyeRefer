import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { queryClient } from '../main';

const StaffList:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [Input, setInput] = useState('');
  let totalPages;

  useEffect(()=>{
    if(!token){
      navigate('/login');
    }
  },[])


  const getStaffs = async(page:any, search:any) => {
    try{
      const response = await api.get(`${Local.GET_STAFF_LIST}?page=${page}&limit=10&find=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(err:any){
      console.log(err);
    }
  }

  const {data: staff, error, isLoading, isError } = useQuery({
    queryKey: ['staff', page, search],
    queryFn: ()=> getStaffs(page, search)
  });

  const deleteStaff = async(staff_uuid:any) =>{
    try{
      await api.delete(`${Local.DELETE_STAFF}/${staff_uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`
          }
      })
      queryClient.invalidateQueries({
        queryKey: ['staff']
      })
      toast.success('Staff deleted successfully');
    }
    catch(err){
      console.log(err);
    }
  }

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

      totalPages = Math.floor(staff.totalStaff/10);

  return (
    <div>
      <div className='d-flex' >
      <input className='form-control w-25 border border-dark mx-3 mb-3 p-2' type="search" name="find" value={Input} onChange={(e:any)=>{setInput(e.target.value)}} />
      <button className='btn btn-outline-dark mb-3 ' type="submit" 
        onClick={(e:any)=>{
        setSearch(Input);
        setPage(1);
        e.preventDefault();
        }}
        >Search</button>
    </div>
    <button type='button' className='btn btn-primary float-end mb-1' onClick={()=>{navigate('/add-staff')}} >Add Staff</button><br />
    <br />
    <hr />
    <table className="table">
  <thead>
    <tr>
      <th scope="col"> Name </th>
      <th scope="col"> email </th>
      <th scope="col"> Gender </th>
      <th scope="col"> Contact </th>
      <th scope="col"> Action </th>
    </tr>
  </thead>
  <tbody>
    {staff.staff.map((stf:any) =>(
      <>
      {stf && (
        <>
          <tr key={stf.uuid} >
            <td>{stf.firstname} {stf.lastname}</td>
            <td> {stf.email} </td>
            <td> {stf.gender} </td>
            <td> {stf.phone} </td>
            <td> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={()=>deleteStaff(stf.uuid)}>
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg> </td>

          </tr>
        </>
      )}
      </>
    ))}
  </tbody>
</table>
<button className='btn btn-outline-dark mx-3' onClick={()=>{setPage((prev)=>prev-1)
}} disabled={page<2?true:false} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
</svg> Prev</button>

<button className='btn btn-outline-dark mx-3' onClick={()=>{setPage((prev)=>prev+1)
}} disabled={page>=totalPages?true:false}
 >Next <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
</svg></button>
    </div>
  )
}

export default StaffList