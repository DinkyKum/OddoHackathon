const express= require('express');
const userRouter=express.Router();
const {userAuth}= require('../Middlewares/auth')
const ConnectionRequest= require('../models/connectionRequest');
const User=require('../models/user')


const USER_SAFE_DATA = "firstName lastName age gender age skills about photoUrl";

userRouter.get('/user/request/received', userAuth, async (req, res)=>{
   try{ const connectionRequests= await ConnectionRequest.find({
        toUserId:req.user._id,
        status:"interested"
    }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"])

    res.json({data: connectionRequests})
}
catch(err){
    res.status(400).send("There is some err"+ err);

}
})

userRouter.get('/user/connections', userAuth, async(req, res)=>{
   
   try{ 
    const loggedInUser=req.user;
    const connectionRequests= await ConnectionRequest.find(
        { $or: [ {fromUserId:loggedInUser._id, status:"accepted"}, {toUserId:loggedInUser._id, status:"accepted"}] }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);


        const data=connectionRequests.map((k)=>{
            if(k.toUserId._id.toString()===loggedInUser._id.toString()){
                return k.fromUserId;
            }
            else {
                return k.toUserId;
            }
        })   
        res.json({data});
    }
    catch(err){
        res.status(400).send("There is some err"+ err);
    }
})

userRouter.get('/user/feed', userAuth, async(req, res)=>{
    try{
        let limit= req.query.limit || 10;
        limit= limit>50 ? 50:limit;

        const page= req.query.page || 1;
        const skip= (page-1)*limit;


        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            $or:[{toUserId:loggedInUser._id}, {fromUserId:loggedInUser._id}]
        }).select("toUserId fromUserId")

        const notToDisplayInFeed= new Set();

        connectionRequests.forEach((k)=> {
            notToDisplayInFeed.add(k.fromUserId.toString())
            notToDisplayInFeed.add(k.toUserId.toString())
        });

        const feed= await User.find({$and:[{ _id: {$nin:Array.from(notToDisplayInFeed)}}, {_id:{$ne:loggedInUser._id}}]}).limit(limit).skip(skip);

        res.send(feed);

    }
    catch(err){
        res.status(400).send("There is some err"+ err);
    }
})


// GET all users
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



module.exports=userRouter