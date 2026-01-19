import React, { useState } from 'react'
import logo2 from "../assets/logo2.png"
import { CiHeart } from "react-icons/ci";
import VideoPlayer from './VideoPlayer'
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa6";
import { MdInsertComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { serverUrl } from '../App';
import axios from 'axios';
import { setPostData } from '../redux/postSlice';


const Post = ({post}) => {
  const {userData}=useSelector((state)=>state.user);
  const {postData}=useSelector((state)=>state.post);
  const [showComment,setShowComment]=useState(true);
  const [message,setMessage]=useState("");
  const dispatch=useDispatch();

  const handleLike=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/post/like/${post._id}`,{withCredentials:true});
      const updatedPost=result.data;

      const updatedPosts=postData.map(p=>p._id==post._id ? updatedPost: p)
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  }

   const handleComment=async ()=>{
    try {
      const result=await axios.post(`${serverUrl}/api/post/comment/${post._id}`,{message},{withCredentials:true});
      const updatedPost=result.data;

      const updatedPosts=postData.map(p=>p._id==post._id ? updatedPost: p)
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='w-[90%] min-h-[450px] flex flex-col gap-[10px]
     bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>
      <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
         <div className='flex justify-center items-center gap-[10px] md:gap-[20px]'>
         <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
         <img src={post.author?.profileImage || logo2} alt=""  className='w-full object-cover'/>
         </div>
         <div className='w-[120px] font-semibold truncate'>{post.author?.userName}</div>
         </div>
         <button className='px-[10px] w-[60px] md:w-[100px] py-[5px] h-[30px] md:h-[40px] bg-[black] text-white rounded-2xl text-[14px] md:text-[16px]'>Follow</button>
      </div>
      <div className='w-[90%] flex items-center justify-center'>
                  {
                  post.mediaType=="image" && <div className='w-[90%] flex items-center justify-center'>
                    <img src={post.media} alt="" className='w-[80%] rounded-2xl object-cover'/>
                  </div>
                  }
                  {
                  post.mediaType=="video" && <div className='w-[80%] flex flex-col items-center justify-center'>
                    <VideoPlayer media={post.media}/>
                  </div>
                  }
      </div> 
      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
        <div className='flex justify-center  items-center gap-[10px]'>
          <div className='flex justify-center items-center gap-[5px]'>
            {!post.likes.includes(userData._id) && <CiHeart className='w-[25px] cursor-pointer h-[25px]' onClick={handleLike}/>}
            {post.likes.includes(userData._id) && <FaHeart className='w-[25px] cursor-pointer h-[25px] text-red-600' onClick={handleLike}/>}
            <span>{post.likes.length}</span>
          </div>
          <div className='flex justify-center items-center gap-[5px]'>
            <MdInsertComment className='w-[25px] cursor-pointer h-[25px]'/>
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div>
          {!userData.saved.includes(post?._id) && <FaRegBookmark className='w-[25px] cursor-pointer h-[25px]'/>}
           {userData.saved.includes(post?._id) && <FaBookmark className='w-[25px] cursor-pointer h-[25px]'/>}
        </div>
      </div>
     {post.caption && <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
        <h1>{post.author.userName}</h1>
        <div>{post.caption}</div>
      </div>}

      {showComment && 
        <div className='w-full flex flex-col gap-[30px] pb-[20px]'>
        <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
         <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
         <img src={post.author?.profileImage || logo2} alt=""  className='w-full object-cover'/>
         </div>
         <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]' placeholder='Write Comment...'
         onChange={(e)=>setMessage(e.target.value)} value={message}/>
         <button className='absolute right-[20px] cursor-pointer' onClick={handleComment}><IoSend className='w-[25px] h-[25px]'/></button>
        </div>
        <div className='w-full max-h-[300px] overflow-auto'>
        {post.comments?.map((com,index)=>(
          <div key={index}>
         <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
         <img src={com.author.profileImage || logo2} alt=""  className='w-full object-cover'/>
         </div>
         <div>{com.message}</div>
        </div>
        ))}
        </div>
        </div>}
    </div>
  )
}

export default Post
