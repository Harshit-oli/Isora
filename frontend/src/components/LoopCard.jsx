import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import logo2 from "../assets/logo2.png"
import FollowButton from "./FollowButton"
import { useNavigate } from 'react-router-dom';
import { MdInsertComment } from "react-icons/md";
import { CiHeart } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setLoopData } from '../redux/loopSlice';
const LoopCard = ({loop}) => {
  const [isPlaying,setIsPlaying]=useState(true);
  const [isMute,setIsMute]=useState(false);
  const [progress,setProgress]=useState(0);
   const videoRef=useRef();
   const navigate=useNavigate(); 
   const {userData}=useSelector((state)=>state.user)
   const {loopData}=useSelector((state)=>state.loop)
   const [showHeart,setShowHeart]=useState(false);
   const dispatch=useDispatch();
   useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>{
      const video=entry.target;
      if(entry.isIntersecting){
        video.play();
        setIsPlaying(true)
      }
      else{
        video.pause();
        setIsPlaying(false)
      } 
    },{threshold:0.6})
    if(videoRef.current){
      observer.observe(videoRef.current);
    }

    return ()=>{
      if(videoRef.current){
      observer.unobserve(videoRef.current);
    }
    }
   },[]);


   const handleClick=()=>{
       if(isPlaying){
        videoRef.current.pause();
        setIsPlaying(false)
       }
       else{
        videoRef.current.play()
        setIsPlaying(true)
       }
   }
   const handleLike=async ()=>{
      try {
        const result=await axios.get(`${serverUrl}/api/loop/like/${loop._id}`,{withCredentials:true});
        const updatedLoop=result.data;
  
        const updatedLoops=loopData.map(p=>p._id==loop._id ? updatedLoop: p)
        dispatch(setLoopData(updatedLoops));
      } catch (error) {
        console.log(error);
      }
    }

    const handleLikeOnDoubleClick=()=>{
      setShowHeart(true);
      setTimeout(()=>setShowHeart(false),6000)
      {!loop.likes?.includes(userData._id)?handleLike():null}
    }
   
    if(videoRef.current){
    videoRef.current.muted = isMute;
    }


    const handleTimeUpdate=()=>{
      const video= videoRef.current;
      if(video){
        const percent=(video.currentTime / video.duration)*100;
        setProgress(percent);
      }
    }
  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative'>
      {showHeart && 
       <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
        <FaHeart className='w-[100px] drop-shadow-2xl h-[100px] text-white'/>
      </div>
      }
        <video ref={videoRef} autoPlay loop src={loop?.media} className='w-full max-h-full' onClick={handleClick} onTimeUpdate={handleTimeUpdate} onDoubleClick={handleLikeOnDoubleClick}/>
        <div className='absolute bottom-0 w-full h-[5px] bg-gray-900'>
          <div className='w-[200px] h-full bg-white transition-all duration-700 ease-linear' style={{width:`${progress}%`}}></div>
        </div>  
        <div className="w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col gap-[10px]">
            <div className='absolute bottom-[10px] right-[10px] cursor-pointer' onClick={()=>setIsMute(!isMute)}>
                {!isMute ? <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/> 
                : <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>}
        </div>
         <div className='flex  items-center gap-[5px]'>
                  <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${loop.author?.userName}`)}>
                  <img src={loop.author?.profileImage || logo2} alt=""  className='w-full object-cover'/>
                  </div>
                  <div className='w-[120px] truncate text-white'>{loop.author?.userName}</div>
                  <FollowButton targetUserId={loop.author?._id} tailwind={"px-[8px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"}/>
                  </div>
                  <div className='text-white px-[10px]'>{loop.caption}</div>
                  <div className='absolute right-0 flex flex-col h-[200px] text-white bottom-[150px] justify-center px-[10px]'>
                    <div className='flex flex-col items-end cursor-pointer '>
                      <div onClick={handleLike}>
                         {!loop.likes.includes(userData._id) && <CiHeart className='w-[25px] cursor-pointer h-[25px]'/>}
                         {loop.likes.includes(userData._id) && <FaHeart className='w-[25px] cursor-pointer h-[25px] text-red-600'/>}
                      </div>
                      <div className='mr-2'>{loop.likes.length}</div>
                    </div>
                    <div className='flex flex-col items-end cursor-pointer '>
                      <div><MdInsertComment className='w-[25px] cursor-pointer h-[25px]'/></div>
                      <div className='mr-2'>{loop.comments.length}</div>
                    </div>
                  </div>
        </div>
    </div>
  )
}

export default LoopCard

