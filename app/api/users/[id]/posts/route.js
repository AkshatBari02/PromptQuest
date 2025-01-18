import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async(request,context)=>{
    try {
        const params = await context.params;
        if (!params || !params.id) {
            console.error("Missing or undefined params.id");
            return new Response("Invalid user ID", { status: 400 });
        }

        await connectToDB();
        const prompts = await Prompt.find({ creator: params.id }).populate('creator');

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return new Response("Failed to fetch all your prompts", { status: 500 });
    }
}