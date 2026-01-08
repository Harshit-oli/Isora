import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowBack } from 'react-icons/io';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';
import { setStoryData } from '../redux/storySlice';

const Upload = () => {
    const [uploadType,setUploadType]=useState("post");
    const [frontendMedia,setFrontendMedia]=useState(null);
     const [backendMedia,setBackendMedia]=useState(null);
     const [mediaType,setMediaType]=useState("");
     const [caption,setCaption]=useState("");
    const {userData}=useSelector((state)=>state.user)
    const navigate=useNavigate();
    const mediaInp=useRef();
    const dispatch=useDispatch();
    const {postData}=useSelector(state=>state.post)
    const {storyData}=useSelector(state=>state.story)
    const {loopData}=useSelector(state=>state.loop)
    const [loading,setLoading]=useState(false);
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
  const uploadPost=async ()=>{
    try {
      const formData=new FormData();
      formData.append("caption",caption);
      formData.append("mediaType",mediaType);
      formData.append("media",backendMedia);
      const result=await axios.post(`${serverUrl}/api/post/upload`,formData,{withCredentials:true})
      dispatch(setPostData([...postData,result.data]))
      setLoading(false);
      navigate("/");
      console.log(result);
    } catch (error) {
      console.log(error);
      
    }
  }

   const uploadStory=async ()=>{
    try {
      const formData=new FormData();
      formData.append("mediaType",mediaType);
      formData.append("media",backendMedia)
      const result=await axios.post(`${serverUrl}/api/story/upload`,formData,{withCredentials:true})
       dispatch(setStoryData([...storyData,result.data]));
       setLoading(false);
       navigate("/");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  const uploadLoop=async ()=>{
    try {
      const formData=new FormData();
      formData.append("caption",caption);
      formData.append("media",backendMedia)
      const result=await axios.post(`${serverUrl}/api/loop/upload`,formData,{withCredentials:true})
      dispatch(setLoopData([...loopData,result.data]))
      setLoading(false);
      navigate("/");
      console.log(result);
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleUpload=()=>{
    setLoading(true);
    if(uploadType=="post"){
      uploadPost();
    }
    else if(uploadType=="story"){
      uploadStory();
    }
    else{
      uploadLoop();
    }
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
            {
            mediaType=="image" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl'/>
              {uploadType!="story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
              placeholder='Write Caption' onChange={(e)=>setCaption(e.target.value)} value={caption}/>}
            </div>
            }

            {
            mediaType=="video" && <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <VideoPlayer media={frontendMedia}/>
              {uploadType!="story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
              placeholder='Write Caption' onChange={(e)=>setCaption(e.target.value)} value={caption}/>}
            </div>
            }
             

              {frontendMedia && 
              <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer rounded-2xl' onClick={handleUpload}>{loading ?<ClipLoader size={30} color='black'/>: `Uplaod ${uploadType}`}</button>
              }
           </div> 
           }
    </div>
  )
}

export default Upload
