import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest } from '../utils/requestSlice';

const Requests = () => {
    const dispatch=useDispatch();
    const requests= useSelector((store)=>store.request)

    const reviewRequest=async(status, _id)=>{

        try{
            const res= await axios.post(BASE_URL+ "/request/review/" + status + '/' + _id, {}, {withCredentials:true});
        console.log(res);
        dispatch(removeRequest(_id))

        }

        catch(err){
            console.error(err);

        }
        
    }

    const fetchRequests=async ()=>{
        try{
            const res= await axios.get(BASE_URL + "/user/requests", {withCredentials:true});
            console.log(res);
            dispatch(addRequest(res.data.data))
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=> {fetchRequests()}, []);

    if(!requests) return;
    if(requests.length===0)  return(<h1> No Requests</h1>);
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold m-5"> Requests </h1>
           
         
           {requests.map((request)=>{
                const {_id, firstName, gender, about, photoUrl}=request.fromUserId;
                return(
                    <div key={_id} className="flex justify-between w-2/3 bg-base-300 m-2 gap-5 py-3 rounded-lg items-center">
                        <div className="flex items-center">
                        <div className="mr-3">
                            <img src={photoUrl} alt="Photo" className="w-20 h-20 rounded-full m-4"/>
                        </div>
                        <div className="ml-3">
                     <p className='font-bold text-lg'>{firstName}</p>
                     <p>Gender: {gender}</p>
                     <p>{about}</p>
                        </div>
                        </div>
                       
                        <div>
                            <div className="mr-3"> 
                        <button className="border-2 border-white p-2 rounded-lg text-white font-bold m-2" onClick={()=>reviewRequest("rejected", request._id )}>Reject</button>
                        <button className="bg-white p-2 rounded-lg text-black font-bold m-2" onClick={()=>reviewRequest("accepted", request._id )}>Accept</button>
                        </div>
                        </div>
                    </div>
                )
            })}


        </div>
      )
    }

export default Requests