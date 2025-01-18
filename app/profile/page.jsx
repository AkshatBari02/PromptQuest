"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchPosts = async () => {
        if (!session?.user.id) return;
        try {
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }   
    };
    fetchPosts();
  }, [session?.user.id]);
  const handleEdit = (post) => {router.push(`/update-prompt?id=${post._id}`)};

  const handleDelete = async (post) => {
    const hasConfirmed = confirm('Are you sure you want to delete this prompt?');
    if(hasConfirmed){
      try {
        await fetch(`/api/prompt/${post._id.toString()}`,{
          method: 'DELETE'
        })
        const filteredPosts = posts.filter((p)=>{p._id !== post._id})
        setPosts(filteredPosts)
        router.push('/')
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Profile
      name="My"
      desc="Welome to your personalized profile page."
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
