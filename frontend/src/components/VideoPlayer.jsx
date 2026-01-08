import React, { useRef, useState } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";

const VideoPlayer = ({media}) => {
    const videoTag=useRef();
    const [mute,setMute]=useState(false);
    const [isPlaying,setIsplaying]=useState(true);
    
    const handleClick=()=>{
        if(isPlaying){
            videoTag.current.pause();
            setIsplaying(false);
        }
        else{
            videoTag.current.play();
            setIsplaying(true);
        }
    }
    if(videoTag.current){
    videoTag.current.muted = mute;
    }


  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-full overFlow-hidden'>
      <video ref={videoTag} src={media} autoPlay loop className='h-[100%] cursor-pointer w-full object-cover rounded-2xl' onClick={handleClick}></video>
      <div className='absolute bottom-[10px] right-[10px]' onClick={()=>setMute(!mute)}>
        {!mute ? <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/> 
        : <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>}
      </div>
    </div>
  )
}

export default VideoPlayer
