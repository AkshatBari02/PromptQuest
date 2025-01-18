import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET (Read Data)
export const GET = async(request,context)=>{
    try {
        const params = await context.params;
        if (!params || !params.id) {
            console.error("Missing or undefined params.id");
            return new Response("Invalid user ID", { status: 400 });
        }

        await connectToDB();
        const prompt = await Prompt.findById( params.id ).populate('creator');
        if(!prompt){
            return new Response("No prompts found !",{status:404})
        }

        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return new Response("Failed to fetch all your prompts", { status: 500 });
    }
}

// PATCH (update)
export const PATCH = async(request,context)=>{
    const {prompt,tag} = await request.json();
    try {
        const params = await context.params;
        if (!params || !params.id) {
            console.error("Missing or undefined params.id");
            return new Response("Invalid user ID", { status: 400 });
        }
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id);
        if(!existingPrompt){
            return new Response("No prompts found !",{status:404})
        }
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();
        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return new Response("Failed to update your prompt", { status: 500 });
    }
}


// DELETE (delete post)
export const DELETE = async(request,context)=>{
    try{
        const params = await context.params;
        if (!params || !params.id) {
            console.error("Missing or undefined params.id");
            return new Response("Invalid user ID", { status: 400 });
        }
        await connectToDB();
        const existingPrompt = await Prompt.findByIdAndDelete(params.id);
        return new Response("Prompt Deleted Successfully !", { status: 200 });
    }catch(error){
        console.error("Error fetching prompts:", error);
        return new Response("Failed to delete your prompt", { status: 500 });
    }
};