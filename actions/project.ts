"use server"

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";


// Creating Project
export async function createProject(data: any): Promise<{ status: number; message: string; data? : {id : string}} | void> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return { status: 401, message: "Unauthorized" };
  }

  if (!orgId) {
    return { status: 401, message: "No organization selected" };
  }

  // Fetch organization membership list
  const membershipList = await (await clerkClient()).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userMembership = membershipList.data.find((member: any) => member.publicUserData.userId === userId);

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create new projects");
  }

  try {
    const project = await prisma.project.create({
        data : {
            name : data.name,
            key : data.key,
            description : data.description,
            organizationId : orgId
        }
    })
    return { status: 200, message: "Project Created", data : project };
  } catch (error) {
    return {status : 500, message : 'Error in Creating' }
  }
}


//Fetching all Projets

export async function getProjects(orgId : string){
  const { userId } = await auth();

  if (!userId) {
    return { status: 401, message: "Unauthorized User" };
  }
  
  if (!orgId) {
    return { status: 401, message: "No organization selected" };
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId : userId,
    }
  })

  if(!user){
    return { status: 401, message: "Unauthorized" };
  }

  const projects = await prisma.project.findMany({
    where: {organizationId : orgId},
    orderBy : {createdAt : "desc"}
  })
  return { status: 200, message: "Fetched projects" , data : projects };
}


//Deleting Project 
export async function deleteProject(projectId : string){
  const {userId, orgId, orgRole} = await auth();

  if (!userId || !orgId) {
    return { status: 401, message: "Unauthorized User" };
  }
  
  if (orgRole !== "org:admin") {
    return { status: 401, message: "Only Admin can delete project" };
  }

  const project = await prisma.project.findUnique({
    where : {
      id : projectId
    }
  });

  if(!project || project.organizationId !== orgId){
    return { status: 404, message: "Project not found" };
  }
  
  const del = await prisma.project.delete({
    where : {
      id : projectId
    }
  })

  if(!del){
    return { status: 500, message: "Failed to delete project" };
  }

  return { status: 200, message: "Project deleted" };
}