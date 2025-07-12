import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {BASE_URL} from '../utils/constants'
import {removeUserFromFeed} from '../utils/feedSlice'

const UserCard = ({user}) => {
  const dispatch=useDispatch();
  const feed=useSelector((store)=>store.feed)

  const sendRequest=async(status, userId)=>{
    try{
      const res= await axios.post(BASE_URL + '/request/send/' + status + '/' + userId, {}, {withCredentials:true})
      console.log(feed);
      dispatch(removeUserFromFeed(userId));
      console.log(feed);

    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
  <figure className="m-3">
    <img
      src={user.photoUrl}
      alt="UserImage" />
  </figure>
  <div className="card-body">
   <h2 className="card-title justify-center">{user.firstName+ " " + user.lastName}</h2>

    <p className="justify-center mb-4 text-center flex">{user.about}</p>
  
    <div className="card-actions justify-center">
      <button className="btn btn-secondary" onClick={()=>sendRequest("interested", user._id)}>Interested</button>
      <button className="btn btn-primary" onClick={()=>sendRequest("ignored", user._id)}>Ignore</button>
    </div>
  </div>
</div>
  )
}

export default UserCard