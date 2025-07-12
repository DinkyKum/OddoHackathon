import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {addFeed} from "../utils/feedSlice"
import UserCard from './UserCard'


const Feed = () => {
  const dispatch= useDispatch();
  const feed = useSelector((store) => store.feed);

  const handleFeed=async()=>{
    if (feed) return;
   try{ 
    const feedData= await axios.get(BASE_URL + "/user/feed", {withCredentials:true});
    dispatch(addFeed(feedData.data));
  }

  catch(err){
    console.error(err);
  }
  }

   useEffect(() =>{ 
    handleFeed()}, []);

    if(!feed) return;
   
  if(feed.length<=0) return(<h1> No feed Available</h1>)
  return (
    (feed) &&
    (<div className="m-2 justify-center flex">
      <UserCard user={feed[0]}/>

    </div>)
  )
}

export default Feed