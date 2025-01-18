"use client";

import {useEffect, useState} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter,useSearchParams } from 'next/navigation';
import Form from '@components/Form';

const EditPrompt = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });
    const searchParams = useSearchParams();
    const promptId = searchParams.get('id');

    useEffect(()=>{
        const getPromptDetails = async()=>{
            if(!promptId) return;
            try {
                const response = await fetch(`/api/prompt/${promptId}`);
                const data = await response.json();
                setPost({
                    prompt: data.prompt,
                    tag: data.tag
                })
            } catch (error) {
                console.error("Failed to fetch prompt details:", error);
            }
            
        }
            getPromptDetails();
    },[promptId])

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if(!promptId){
            alert('Prompt Id not found !')
        }
        try {
            const response = await fetch(`/api/prompt/${promptId}`,
                {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: post.prompt,
                        tag: post.tag
                    })
                }
            )
            if(response.ok){
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        }finally{
            setSubmitting(false);
        }
    }
  return (
    <Form
        type= "Edit"
        post= {post}
        setPost= {setPost}
        submitting= {submitting}
        handleSubmit= {updatePrompt}
    />
)
}

export default EditPrompt