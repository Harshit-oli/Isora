    import React, { useEffect } from 'react'
    import { useDispatch } from 'react-redux'
    import axios from 'axios';
    import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';

    const GetAllPost = () => {
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchPost=async ()=>{
            try {
                const result=await axios.get(`${serverUrl}/api/post/getAll`,{withCredentials:true});
                dispatch(setPostData(result.data))
            } catch (error) {
                console.log(error); 
            }
        }
        fetchPost();
    },[dispatch]);
    }

    export default GetAllPost