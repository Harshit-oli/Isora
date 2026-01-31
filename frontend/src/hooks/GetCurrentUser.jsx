    import React, { useEffect } from 'react'
    import { useDispatch } from 'react-redux'
    import axios from 'axios';
    import { serverUrl } from '../App';
    import { setFollowing, setUserData } from '../redux/userSlice';

    const GetCurrentUser = () => {
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchUser=async ()=>{
            try {
                const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
                dispatch(setUserData(result.data))
                dispatch(setFollowing(result.data.following))
            } catch (error) {
                console.log(error); 
            }
        }
        fetchUser();
    },[]);
    }

    export default GetCurrentUser
