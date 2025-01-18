"use client";

import {useEffect, useState, Suspense} from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
const Form = dynamic(
    ()=>import("@components/Form"),
    {
        ssr: false
    }
)
const EditPrompt = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });
    const [promptId, setPromptId] = useState(null);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        setPromptId(id);
      }, []);

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
    <Suspense fallback={<div>Loading...</div>}>
        <Form
            type= "Edit"
            post= {post}
            setPost= {setPost}
            submitting= {submitting}
            handleSubmit= {updatePrompt}
        />
    </Suspense>
)
}

export default EditPrompt