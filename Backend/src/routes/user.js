const express= require('express');
const userRouter=express.Router();
const {userAuth}= require('../Middlewares/auth')
const ConnectionRequest= require('../models/connectionRequest');
const User=require('../models/user')


const USER_SAFE_DATA = "name age gender age skills about photoUrl";

userRouter.get('/user/request/received', userAuth, async (req, res)=>{
   try{ const connectionRequests= await ConnectionRequest.find({
        toUserId:req.user._id,
        status:"pending"
    }).populate("fromUserId", ["name", "age", "gender", "skills", "about", "photoUrl"])

    res.json({data: connectionRequests})
}
catch(err){
    res.status(400).send("There is some err"+ err);

}
})

userRouter.get('/user/requests', userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Received requests (i.e., someone sent a request to this user)
    const receivedRequests = await ConnectionRequest.find({
      toUserId: userId
    }).populate("fromUserId", ["name", "age", "gender", "skills", "about", "photoUrl"]);

    // Sent requests (i.e., this user sent a request to someone)
    const sentRequests = await ConnectionRequest.find({
      fromUserId: userId
    }).populate("toUserId", ["name", "age", "gender", "skills", "about", "photoUrl"]);

    res.json({
      received: receivedRequests,
      sent: sentRequests
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching connection requests: " + err.message);
  }
});


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

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id },
        { fromUserId: loggedInUser._id }
      ]
    }).select("toUserId fromUserId");

    const notToDisplayInFeed = new Set();

    connectionRequests.forEach((req) => {
      notToDisplayInFeed.add(req.fromUserId.toString());
      notToDisplayInFeed.add(req.toUserId.toString());
    });

    // ✅ Removed pagination — returns all filtered users
    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(notToDisplayInFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    });

    res.send(feed);
  } catch (err) {
    res.status(400).send("There is some error: " + err);
  }
});





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