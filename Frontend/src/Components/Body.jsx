import React from 'react';
import Navbar from './Navbar';
import {Outlet, useNavigate} from 'react-router';
import Footer from './Footer'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import { useSelector } from 'react-redux';

const Body = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const userData = useSelector((store) => store.user);
  const fetchUser=async ()=>{
    if(userData) return;
    try{
      const res= await axios.get(BASE_URL+ "/profile", {withCredentials:true});
      dispatch(addUser(res.data));
    }
    catch(err){
      
      navigate("/login");
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUser()
  }, []);

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body;