import sendMail from "../config/Mail.js";
import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const register=async(req,res)=>{
  try {
      const {name,password,email,userName}=req.body;
      if(!name || !password || !email){
        return res.status(400).json({
            success:false,
            message:"All fields must be fulfilled",
        })

    }
        const findByEmail=await User.findOne({email});
        if(findByEmail){
           return res.status(400).json({
            success:false,
            message:"User already exist",
        })
    }
        const findByUserName=await User.findOne({userName});
        if(findByUserName){
           return res.status(400).json({
            success:false,
            message:"UserName already exist",
        })
    }
    if(password.length<6){
        return res.status(400).json({
            message:"password must be atleast  6 character"
        })
    }


    const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            userName,
            email,
            password:hashedPassword,
        })

        const token=await genToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:24*60*60*1000,
            secure:false,
            sameSite:"strict"
        })

        return res.status(200).json({
            success:true,
            message:"user created successfully",
            user,
        })
  } catch (error) {
    return res.status(500).json({
            success:false,
            message:`signup error ${error}`
        })
  }
}

export const logIn=async(req,res)=>{
  try {
      const {userName,password}=req.body;
      if( !userName || !password){
        return res.status(400).json({
            success:false,
            message:"All fields must be fulfilled",
        })
    }
        const user=await User.findOne({userName});
        if(!user){
           return res.status(400).json({
            success:false,
            message:"user not exist",
        })
    }
   const isMatch=await bcrypt.compare(password,user.password)

   if(!isMatch){
    return res.status(400).json({
        success:true,
        message:"password does not matched"
    })
   }
        const token=await genToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:24*60*60*1000,
            secure:false,
            sameSite:"strict"
        })

        return res.status(200).json({
            success:true,
            message:"user created successfully",
            user,
        })
  } catch (error) {
    return res.status(500).json({
            success:true,
            message:`signup error ${error}`
        })
  }
}

export const signOut=async (req,res)=>{
        try {
            res.clearCookie("token");
            return res.status(200).json({
                success:true,
                message:"user Logout successfully",
            })
        } catch (error) {
            return res.status(500).json({
            success:true,
            message:`signup error ${error}`
        })
        }
}

export const sendOtp=async(req,res)=>{
   try {
    const {email}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found",
        })
    }

    const otp=Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp=otp;
    user.otpExpires=Date.now() + 5*60*1000
    user.isOtpVerified=false

    await user.save();

    await sendMail(email,otp);

    return res.status(200).json({
        success:true,
        message:"email successfully send"
    })
     
   } catch (error) {
       return res.status(500).json({
            success:false,
            message:"server otp error",
        })
   }
}

export const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;

        const user = await User.findOne({email});
        if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()){
            return res.status(400).json({
             success:false,
            message:"invalid or expired otp",
            })
        }
        user.isOtpVerified=true;
        user.resetOtp=undefined;
        user.otpExpires=undefined;

        await user.save();

        return res.status(200).json({
            success:true,
            message:"otp verified"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"verify otp error"
        })
    }
}

export const resetPassword=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user || !user.isOtpVerified){
            return res.status(400).json({
                message:"otp verification required"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);
        user.password=hashedPassword;
        user.isOtpVerified=false;
        await user.save();
       
         return res.status(200).json({
            success:true,
            message:"Password reset successfully",
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"reset otp error"
        }) 
    }
}