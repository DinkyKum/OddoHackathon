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

    alliedCourse:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
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