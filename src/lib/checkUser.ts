import { currentUser, User } from "@clerk/nextjs/server"
import { prisma } from "./prisma";


export const checkUser = async()=>{
    const user : User  = await currentUser() as User;

    if(!user){
        return null;
    }

    try{
        const loggedUser = await prisma.user.findUnique({
            where: {
                clerkUserId : user.id
            }
        })
        if(loggedUser){
            return loggedUser;
        }

        const name = `${user.firstName} ${user.lastName}`
        const newUser = await prisma.user.create({
            data : {
                clerkUserId : user.id,
                name : name,
                email : user.emailAddresses[0].emailAddress,
                imageUrl : user.imageUrl
            }
        })
        return newUser;
    }catch(error){
        console.log("Error creating User", error)
        return;
    }
}