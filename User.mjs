import mongoose from "mongoose";



const userSchema = mongoose.Schema({
  firstName:{
    type:String,
    required:true,

    
  },
  lastName:{
    type:String,
    required:true,
  },
  hobby:{
    type:Array,
    required:true,
  },
  
  
});


const User = mongoose.model("User",userSchema);

export default User;


//