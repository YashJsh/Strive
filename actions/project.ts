"use server"

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
