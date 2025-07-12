const mongoose= require('mongoose');
const validator= require('validator');
const jwt=require('jsonwebtoken');
const bcrypt= require('bcrypt');

const userSchema= new mongoose.Schema({
    name:{ 
        type: String,
        required: true,
        minLength: 3,
    },

    // lastName:{
    //     type: String,
    //     maxLength: 50
    // },

    location:{
        type: String,
    },

    emailId:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid Email Id");
            }
        }
    },

    password:{
        required: true,
        type: String,
        minLength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password");
            }
        }
    },

    gender:{
        type: String,
        maxLength: 1,
        uppercase: true,
        validate(value){
            if(!["M", "F", "O"].includes(value)){
                throw new error;
            }
        }
    },

    age:{
        type: Number,
        min: 18,
    },

    photoUrl:{
        type:String,
        default: "https://cdn-icons-png.flaticon.com/256/149/149071.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL");
            }
        }
    },

    about:{
        type: String,
        default: "This is the default about data"
    },

    skillsWanted:{
        type:[String],
        lowercase: true,
    },

    skillsOffered:{
        type:[String],
        lowercase: true,
    },
    rating:{
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isSpam:{
        type: Boolean,
        default: false
    },
    isBanned:{
        type: Boolean,
        default: false
    },

    availability:{
        type: String,
        enum: ["weekdays", "weekends", "full time"],
    },

    timeAvailability:{
        type: String,
        enum: ["morning", "afternoon", "evening", "night"],
    },

  visibility: {
  type: String,
  lowercase: true,
  default: "public",
  enum: ["public", "private"],
  validate(value) {
    if (!["public", "private"].includes(value)) {
      throw new Error("Visibility must be 'public' or 'private'");
    }
  }
}
},

{
    timestamps:true
}
)

userSchema.methods.getJWT= async function(){
    const token= await jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;
}

userSchema.methods.validatePassword= async function(passwordInputByUser){
    const isPasswordValid= await bcrypt.compare(passwordInputByUser, this.password);
    return(isPasswordValid);
}

module.exports= mongoose.model('User', userSchema);
