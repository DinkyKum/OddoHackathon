const express= require('express');
const profileRouter=express.Router();
const {userAuth}=require('../Middlewares/auth');
const {validateEditData}= require('../utils/validation')
const validator= require('validator');
const bcrypt=require('bcrypt');

profileRouter.get('/profile', userAuth, async(req, res)=>{
    try{
        const user= req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.put('/profile/edit', userAuth, async(req, res)=>{
   try { 
    validateEditData(req);
    const loggedInUser= req.user;

    Object.keys(req.body).forEach((k)=>
        loggedInUser[k]=req.body[k]
    )

    await loggedInUser.save();

    res.send("User Updated Succesfully" + loggedInUser);
}
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.patch('/profile/password', userAuth, async(req, res)=>{
   try { 
    const isCurrentPasswordValid= req.user.validatePassword(req.body.currentPassword);

    if(!isCurrentPasswordValid){
        throw new Error("Invalid Credentials");
    }
    if(!validator.isStrongPassword(req.body.newPassword)){
        throw new Error("Enter a strong password")
    }

    const Hashpassword= await bcrypt.hash(req.body.newPassword, 10);
    req.user.password= Hashpassword;
    req.user.save();
    res.send("Password changed Successfully");
}

catch(err){
    res.status(400).send("There is some error" + err);
}
    
})

module.exports=profileRouter;