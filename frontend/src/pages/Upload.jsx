import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { IoMdArrowBack } from 'react-icons/io';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

const Upload = () => {
    const [uploadType,setUploadType]=useState("post");
    const [frontendMedia,setFrontendMedia]=useState(null);
     const [backendMedia,setBackendMedia]=useState(null);
     const [mediaType,setMediaType]=useState("");
    const {userData}=useSelector((state)=>state.user)
    const navigate=useNavigate();
    const mediaInp=useRef();
    const handlePost=(e)=>{
     const file=e.target.files[0];
     console.log(file);
     if(file.type.includes("image")){
      setMediaType("image");
     }
     else{
      setMediaType("video");
     }
     setBackendMedia(file);
     setFrontendMedia(URL.createObjectURL(file));
    }
  return (
    <div className='w-full bg-black min-h-[100vh] flex flex-col items-center'>
      <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]'><IoMdArrowBack className='text-white w-[25px] h-[25px] cursor-pointer'
            onClick={()=>{navigate(`/profile/${userData.userName}`)}}/>
             <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
           </div>

           <div className='w-[80%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]'>
            <div className={`${uploadType=="post"?"bg-black shadow-2xl shadow-black text-white":""}
               w-[28%] rounded-full h-[55%] cursor-pointer hover:h-[60%] max-w-[100px] items-center flex justify-center font-semibold`} 
               onClick={()=>setUploadType("post")}>Post</div>
            <div className={`${uploadType=="story"?"bg-black shadow-2xl shadow-black text-white":""}
               w-[28%]  rounded-full h-[55%] cursor-pointer hover:h-[60%] max-w-[100px] items-center flex justify-center font-semibold`}
                onClick={()=>setUploadType("story")}>Story</div>
            <div className={`${uploadType=="loop"?"bg-black shadow-2xl shadow-black text-white":""}
               w-[28%]  rounded-full h-[55%] cursor-pointer hover:h-[60%] max-w-[100px] items-center flex justify-center font-semibold`}
                onClick={()=>setUploadType("loop")}>Loop</div>
           </div>
          {!frontendMedia && 
             <div className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center 
           justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d] text-white' onClick={()=>mediaInp.current.click()}>
            <input type="file" className='hidden' ref={mediaInp} onChange={handlePost}/>
            <FaPlus className="text-white cursor-pointer w-[25px] h-[25px]"/>
            <div className='text-white text-[19px] font-semibold'>Upload {uploadType}</div>
           </div>}
           {frontendMedia &&
           <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
            {mediaType=="image" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl'/>
              {uploadType!="story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
              placeholder='Write Caption'/>}
              </div>}

              {frontendMedia && 
              <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer rounded-2xl'>Upload {mediaType}</button>
              }
           </div> 
           }
    </div>
  )
}

export default Upload
