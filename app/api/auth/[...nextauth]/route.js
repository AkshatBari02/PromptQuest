import User from "@models/user";
import NextAuth from "next-auth";
import { connectToDB } from "@utils/database";
import GoogleProvider from 'next-auth/providers/google';



const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
        async session({session}){
            try {
                const sessionUser = await User.findOne({ email: session.user.email });
                if (!sessionUser) {
                    console.error(`User not found for email: ${session.user.email}`);
                    return session; // Return the session without modifying it
                }
                session.user.id = sessionUser._id.toString();
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session; // Return the session as is in case of error
            }
        },
        async signIn({profile}){
            try {
                await connectToDB();
                const userExists = await User.findOne({ email: profile.email });
        
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(/\s+/g, "_").toLowerCase(),
                        image: profile.picture,
                    });
                }
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false; // Reject the sign-in if there's an error
            }
        }
    }
})

export {handler as GET, handler as POST};