const express= require('express');
const requestRouter= express.Router();
const {userAuth}=require('../Middlewares/auth');
const ConnectionRequest= require('../models/connectionRequest');
const User = require('../models/user')
// const sendEmail = require('../utils/sendEmail')

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res)=>{
    try{
    const fromUserId= req.user._id;
    const toUserId= req.params.toUserId;
    const status= req.params.status;

    const toUser= await User.findById(toUserId);
    if(!toUser){
        return res.status(404).send("User doesnt exists");
    }

    const validStatus=["pending"]

    const isStatusValid= validStatus.includes(status);
    if(!isStatusValid){
        throw new Error("Invalid status ")
    }

    const isConnectionRequestDuplicate= await ConnectionRequest.findOne({
        $or:[{fromUserId, toUserId}, {fromUserId:toUserId, toUserId:fromUserId}]
    })

    if(isConnectionRequestDuplicate){
        throw new Error("Connection Request already exists");
    }

    const connectionRequest= new ConnectionRequest({fromUserId, toUserId, status});
    await connectionRequest.save();

    // const emailRes=await sendEmail.run("A new friend request from "+req.user.firstName, req.user.firstName+" is interested in you!");
    // console.log(emailRes);

    res.send("Connection Request sent Succesfully");
}

catch(err){
    res.status(400).send("There is some error"+ err);
}
})

requestRouter.post('/request/review/:status/:reqId', userAuth, async (req, res)=>{
    try {
    const {status, reqId}= req.params;
    const allowedStatus= ["accepted", "rejected"];
    const isStatusValid=allowedStatus.includes(status);
    const loggedInUser=req.user;

    if(!isStatusValid){
        throw new Error("Status is Invalid");
    }

    const connectionRequest= await ConnectionRequest.findOne({
        toUserId: loggedInUser._id,
        status:"pending",
        _id:reqId
    })

    if(!connectionRequest){
        throw new Error("Connection Request doesnt exist");
    }

    connectionRequest.status= status;
    await connectionRequest.save();
    res.json({
        "message": `Request ${status} successfully`,
        "data": connectionRequest
     });
}

catch(err){
    res.status(400).send("There is some error"+ err);
}
})

module.exports= requestRouter;

