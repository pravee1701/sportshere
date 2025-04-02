import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:[3 , "Firstname should be atleast 3 characters long"],
        },
        lastname:{
            type:String,
            minLength:[3, "Lastname should be atleast 3 characters long"],
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5, "Email should be atleast 5 characters long"],
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user",
    }
},{
    timestamps:true,
})

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id: this._id, role: this.role}, process.env.JWT_SECRET, {expiresIn: "1d"});
    
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model("User", userSchema);

export default User;