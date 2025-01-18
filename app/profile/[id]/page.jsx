'use client';
import Loading from '@components/loading';
import Profile from '@components/Profile';
import { useSearchParams } from 'next/navigation';
import {useState,useEffect} from 'react';

const UserProfile = ({params})=>{
    const searchParams = useSearchParams();
    const userName = searchParams.get('name');

    const [userPosts, setUserPosts] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const fetchPosts = async()=>{
            const resolvedParams = await params;
            const response = await fetch(`/api/users/${resolvedParams?.id}/posts`);
            const data = await response.json();

            setUserPosts(data);
            setLoading(false);
        }
            fetchPosts();
    },[params])
    return(
        <>
        {loading ? (
            <Loading/>
        ) : (
            <Profile name={userName} desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`} data={userPosts} />
        )}
        </>
    )
}

export default UserProfile;