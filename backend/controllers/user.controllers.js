import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser=async(req,res)=>{
    try {
        const userId=req.userId;
        const user=await User.findById(userId).populate("posts loops");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found",
            })
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }

}


export const suggestedUsers=async (req,res)=>{
    try {
        const users=await User.find({
            _id:{$ne:req.userId}
        }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
            success:false,
            message:`get suggested users error ${error}`,
        })  
    }
}

export const editProfile=async (req,res)=>{
    try {
        console.log("file:", req.file);
        console.log("body:", req.body);
        const {name,userName,bio,profession,gender}=req.body;
        const user=await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const sameUserWithUserName=await User.findOne({userName}).select("-password")
        if(sameUserWithUserName && sameUserWithUserName._id.toString() !== req.userId){
            return res.status(400).json({message:"User Already Exist"})
        }
        let profileImage;
        if(req.file){
            profileImage=await uploadOnCloudinary(req.file.path)
        }
         user.name=name
         user.userName=userName
         if (profileImage) {
         user.profileImage = profileImage;
        }

         user.bio=bio
         user.profession=profession
         user.gender=gender
         await user.save(); 
         return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Edit profile Error ${error}`
        })
    }
}

export const getProfile=async(req,res)=>{
    try {
        const {userName}=req.params;
        const user=await User.findOne({userName}).select("-password").populate("posts loops followers following");
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        return res.status(200).json({
            success:true,
            message:"user found",
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`user profile Error ${error}`
        })
    }
}

export const follow=async(req,res)=>{
    try {
        const currentUserId=req.userId;
        const targetUserId=req.params.targetUserId;
        if(!targetUserId){
            return res.status(400).json({message:"target user is not found"});
        }

        if(currentUserId==targetUserId){
            return res.status(400).json({message:"you can not follow yourself."})
        }

        const currentUser=await User.findById(currentUserId);
        const targetUser=await User.findById(targetUserId);

        const isFollowing=currentUser.following.includes(targetUserId);

        if(isFollowing){
            currentUser.following=currentUser.following.filter(id=>id.toString() != targetUserId);
            targetUser.followers=targetUser.followers.filter(id=>id.toString() != currentUserId);

            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({
                following:false,
                message:"unfollow successfully",
            })
        }
        else{
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId);
            await currentUser.save();
            await targetUser.save(); 

            return res.status(200).json({
                following:true,
                message:"follow successfully",
            })
        }
    } catch (error) {
        return res.status(500).json({message:`follow error ${error}`})
    }
}