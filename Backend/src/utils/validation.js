const validator=require('validator');

const validateSignupData=(req)=>{
    const {firstName, lastName, emailId, password}=req.body;

    if(!(firstName || lastName)){
        throw new Error("Invalid Name");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid EmailId");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong password");
    }
}

const validateEditData=(req)=>{
    const editableFields= ["firstName", "lastName", "gender", "age", "photoUrl", "skills", "about"];

    const isEditableField= Object.keys(req.body).every((k)=>editableFields.includes(k));

    if(!isEditableField){
        throw new Error("Edit Not Allowed");
    }

    if (req.body.skills && req.body.skills.length > 10) {
        throw new Error("Skills cannot exceed 10");
      }
    
     
      if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
        throw new Error("Enter a valid PhotoUrl");
      }
}


module.exports={validateSignupData, validateEditData};