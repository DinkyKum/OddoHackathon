import React from 'react'
import { useDispatch} from 'react-redux';
import { useState } from 'react';
import UserCard from './UserCard';
import axios from 'axios'
import { BASE_URL } from '../utils/constants';
import {addUser} from '../utils/userSlice'

const EditProfile = ({user}) => {
   
      const dispatch = useDispatch();

      const [firstName, setFirstName] = useState(user.firstName || "");
      const [lastName, setLastName] = useState(user.lastName|| "");
      const [gender, setGender] = useState(user.gender||"");
      const [photoUrl, setPhotoUrl] = useState(user.photoUrl|| "");
      const [about, setAbout]= useState(user.about||"");
      const [showToast, setShowToast]=useState(false);

      const editProfile=async()=>{
        try{
          const res= await axios.put(BASE_URL + "/profile/edit",{firstName, lastName, gender, photoUrl, about}, {withCredentials: true})
          
          dispatch(addUser(res.data));
          console.log("Successful")
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
        }
        catch(err){
        console.error(err);
        }

      }
    
  return  (
    <div className="flex items-start justify-center">
      <div className='justify-center flex items-center'>
    <div className="card bg-base-300 w-96 shadow-xl m-4">
  <div className="card-body">
    <h2 className="card-title justify-center">Edit Profile</h2>
    <div>
    <label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text">First Name </span>
  </div>
  <input type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

  <div className="label mt-4">
    <span className="label-text">Last Name</span>
  </div>
  <input type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

  <div className="label mt-4">
    <span className="label-text">Gender </span>
  </div>
  <input type="text" value={gender} onChange={(e)=> setGender(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

  <div className="label mt-4">
    <span className="label-text">PhotoUrl</span>
  </div>
  <input type="text" value={photoUrl} onChange={(e)=> setPhotoUrl(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

  <div className="label mt-4">
    <span className="label-text">About</span>
  </div>
  {/* <input type="text" value={about} onChange={(e)=> setAbout(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" /> */}

  <textarea className="textarea textarea-bordered" type="text" value={about} onChange={(e)=> setAbout(e.target.value)} placeholder="Type here"> </textarea>

</label>
    </div>
    
  </div>

  <div className="card-actions justify-center mb-4">
      <button className="btn btn-primary" onClick={editProfile}>Save</button>
    </div>

</div>

<UserCard user={{firstName, lastName, gender, about, photoUrl}}/>
</div>

{showToast && (<div className="toast toast-top toast-center">
  <div className="alert alert-info">
    <span>Profile Saved Successfully</span>
  </div>
</div>)
}



    </div>
    
  )
}


export default EditProfile;