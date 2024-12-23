"use server"

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug : string){
    const { userId } = await auth();
    
    if(!userId){
        return { status: 401, message: "Unauthorized" };
    }

    //Checking if user exist in database or not
    const user = await prisma.user.findUnique({ 
        where: { clerkUserId: userId },
    })
    if(!user){
        return { status: 404, message: "User not found" };
    }

    
    //Getting organization details
    const organization = (await clerkClient()).organizations.getOrganization({slug})

    if(!organization){
        return null
    }

    return {organization};
}