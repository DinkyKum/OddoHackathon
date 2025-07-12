const cron = require('node-cron');
const {subDays, startOfDay, endOfDay}=require('date-fns');
const ConnectionRequest=require('../models/connectionRequest');
const sendEmail=require('./sendEmail')

cron.schedule("0 8 * * *", async()=>{
    try{
    const yesterday=subDays(new Date(), 1);
    const yesterdayStart=startOfDay(yesterday);
    const yesterdayEnd=endOfDay(yesterday);

    const pendingRequests= await ConnectionRequest.find({
        status:"interested",
        createdAt:{
            $gte: yesterdayStart,
            $lt: yesterdayEnd
        }
    }).populate("fromUserId toUserId");

    const listOfEmails=[...new Set(pendingRequests.map((req)=> req.toUserId.emailId))];
    console.log(listOfEmails);

    for (const email of listOfEmails){
        try{
            const res=await sendEmail.run(
                "Pending Requests for "+ email,
                "There are several pending requests, please login to DevConnect to either accept or reject the request."

            )
            console.log(res);

        }
        catch(err){
            console.err(err);
        }
    }

    }
    catch(err){
        console.err(err);
    }
})

