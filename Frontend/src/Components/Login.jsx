import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from "react-router";
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [emailId, setEmailId] = useState("Dinky@gmail.com");
  const [password, setPassword] = useState("Dinky@123");
  const [firstName, setFirstName]=useState("");
  const [lastName, setLastName]=useState("");
  const [isLogin, setIsLogin]=useState(true);
  const [error, setError]=useState("");

  const dispatch = useDispatch()
  const navigate=useNavigate();

  const HandleLogin= async ()=>{
    try{
      const res= await axios.post(BASE_URL+ "/login", {emailId, password}, {withCredentials:true});
      dispatch(addUser(res.data))
      navigate('/')
    }

    catch(err){
      console.log(err);
      setError(err.response.data || "Something went wrong");
    }
  }

  const HandleSignUp=async ()=>{
    try{
      const res= await axios.post(BASE_URL+ "/signup", {firstName, lastName, emailId, password}, {withCredentials:true});
      dispatch(addUser(res.data.data));
      navigate('/profile')

    }
    catch(err){
      console.error(err);
      setError(err.response.data || "Something went wrong");
    }
  }

  return (
    <div className='justify-center flex'>
    <div className="card bg-base-200 w-96 shadow-xl m-4">
  <div className="card-body">
    <h2 className="card-title justify-center">{isLogin? "Login" : "Sign Up"}</h2>
    <div>
    <label className="form-control w-full max-w-xs">

    {!isLogin && (
      <>
    <div className="label">
    <span className="label-text">First Name </span>
  </div>
  <input type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

  <div className="label">
    <span className="label-text">Last Name</span>
  </div>
  <input type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
  </>)}

  <div className="label">
    <span className="label-text">E-mail ID </span>
  </div>
  <input type="text" value={emailId} onChange={(e)=> setEmailId(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

  <div className="label mt-4">
    <span className="label-text">Password</span>
  </div>
  <input type="text" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

</label>
    </div>
    {error && (<p className="text-red-500">{error}</p>)}
    <div className="card-actions justify-center mt-4">
      <button className="btn btn-primary" onClick={isLogin? HandleLogin : HandleSignUp}> {isLogin? "Login" : "Sign Up"}</button> 
    </div>
    <p onClick={()=> setIsLogin((value)=>!value)} className="text-center cursor-pointer"> {isLogin? "New User? SignUp here": "Existing User? Login here"}</p>
  </div>
</div></div>
  )
}

export default Login