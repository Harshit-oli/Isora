import React from 'react'
import logo2 from "../assets/logo2.png"

const Post = ({postData}) => {
  return (
    <div className='w-[90%] min-h-[450px] flex flex-col gap-[10px]
     bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl'>
      <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
         <div className='flex justify-center items-center gap-[10px] md:gap-[20px]'>
         <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
         <img src={postData.author?.profileImage || logo2} alt=""  className='w-full object-cover'/>
         </div>
         <div className='w-[200px] font-semibold truncate'>{postData.author?.userName}</div>
         </div>
      </div>
    </div>
  )
}

export default Post
