import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from '../utils/connectionSlice';

const connections = () => {
    const dispatch= useDispatch();
    const connections= useSelector((store)=>store.connection)

    const fetchConnections= async()=>{
       
        try{
            const res= await axios.get(BASE_URL + '/user/connections', {withCredentials: true});
            console.log(res);
     
            dispatch(addConnection(res.data.data));
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        fetchConnections()}
    , [])

    if(!connections) return;
    if(connections.length===0) return(<h1> No Connections</h1>);


  return (
    <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold m-5"> Connections </h1>
       
     
       {connections.map((connection)=>{
            const {_id, firstName, lastName, gender, about, photoUrl}=connection;
            return(
                <div className="flex items-center w-1/2 bg-base-300 m-2 gap-7 py-2">
                    <div>
                        <img src={photoUrl} alt="Photo" className="w-20 h-20 rounded-full ml-3"/>
                    </div>
                    <div>
                 <p className='font-bold text-lg'>{firstName+ " "+ lastName}</p>
                 <p>Gender: {gender}</p>
                 <p>{about}</p>
                    </div>
                </div>
            )
        })}
    

        
    </div>
  )
}

export default connections