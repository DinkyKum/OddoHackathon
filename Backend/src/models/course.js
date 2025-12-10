const mongoose= require('mongoose');
const User=require('../models/user')

const courseSchema= new mongoose.Schema({
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },

    isSwap:{
        type:Boolean,
        required: true,
        default: false
    },

    fee:{
        type:Number,
    },

    skills:{
        type:[String]
    },

    status:{
        type:String,
        enum:["pending", "accepted", "rejected"],
    },

    // Track if teacher has accepted (for pay courses, payment still needed)
    teacherAccepted:{
        type:Boolean,
        default: false
    },

    alliedCourse:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    
    // Payment fields for pay courses
    paymentStatus:{
        type:String,
        enum:["pending", "paid", "failed"],
        default: "pending"
    },
    
    transactionHash:{
        type:String,
    },
    
    paymentWalletAddress:{
        type:String,
    },
},

{
    timestamps:true
}
)

// courseSchema.pre("save", function(next){
//     const connectionRequest= this;
//     if(connectionRequest.fromUserId.equals(this.toUserId)){
//         throw new Error("You cannot send request to yourself");
//     }
//     next();
// })


module.exports= mongoose.model("Course", courseSchema);