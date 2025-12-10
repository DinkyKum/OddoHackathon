import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';
import axios from 'axios';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const HandleLogout= async ()=>{
    try{
    await axios.post(BASE_URL + '/logout', {}, {withCredentials:true});
    dispatch(removeUser());
    navigate('/login');
  }
  catch(err){
  }
  }

  return (
    <div className="navbar bg-base-200">

    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl">SkillSwap</Link>
    </div>

{ user &&(<div className="flex-none gap-2">
   <div className="form-control">
     {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
   </div>
   <div className="dropdown dropdown-end">
     <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
       <div className="w-10 rounded-full bg-base-300">
         <img
           alt="User"
           src={user.photoUrl} />
       </div>
     </div>
     <ul
       tabIndex={0}
       className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
       <li>
         <Link to="/profile" className="justify-between">
           Profile
           <span className="badge">New</span>
         </Link>
       </li>
       <li><Link to='/connections'>Connections</Link></li>
       <li><Link to='/requests'>Requests</Link></li>
       <li><Link to='/course-requests'>Course Requests</Link></li>
       <li><Link to='/my-courses'>My Courses</Link></li>
       <li><Link to='/'>Feed</Link></li>
       <li><Link onClick={HandleLogout}>Logout</Link></li>
       
     </ul>
   </div>
 </div>

)
   
}
   
  </div>
  )
}

export default Navbar;