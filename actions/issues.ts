"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Issue, IssuePriority, IssueStatus } from "@prisma/client";

export interface dataSchema{
    title : string,
    status : IssueStatus,
    description? : string,
    priority : IssuePriority,
    sprintId : string,
    assigneeId : string
}


export async function createIssue({projectId, data} : {projectId: string, data: dataSchema}) {
    const {userId, orgId} = await auth();
    if(!userId || !orgId){
        return {status : 403, success : "false" , message : "Access denied"};
    }
    let user = await prisma.user.findUnique({
        where : {clerkUserId : userId}
    })
    const lastIssue = await prisma.issue.findFirst({
        where : { projectId : projectId, status : data.status},
        orderBy : { order : "desc"}
    })
    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await prisma.issue.create({
        data : {
            title : data.title,
            description : data.description,
            status : data.status,
            priority : data.priority,
            projectId : projectId,
            sprintId : data.sprintId,
            reporterId : user?.id,
            assigneeId : data.assigneeId || null,
            order : newOrder
        },
        include : {
            assignee : true,
            reporter : true
        }
    })

    return { status : 200, success : "true", message : "Issue created successfully", data : issue }
}


export async function getIssuesForSprint(sprintId : string){
    const {userId, orgId} = await auth();
    if(!userId || !orgId){
        return {status : 403, success : "false" , message : "Access denied"};
    }
    const issues = await prisma.issue.findMany({
        where : {
            sprintId : sprintId
        },
        orderBy : [{status : "asc"}, {order: "desc"}],
        include : {
            assignee : true,
            reporter : true
        }
    })
    return { status : 200, success : "true", message : "Issues for sprint fetched successfully", data : issues }
}

export async function updateIssueOrder(updateIssues : Issue[]){
    const {userId, orgId} = await auth();
    if(!userId || !orgId){
        return {status : 403, success : "false" , message : "Access denied"};
    }
    await prisma.$transaction(async(prisma)=>{
        for(const issue of updateIssues){
            await prisma.issue.update({ 
                where : {id : issue.id},
                data : {
                    status : issue.status,
                    order : issue.order
                }
            })
        }
    })
    return { status : 200, success : "true", message : "Issue order updated successfully"}
}

export async function deleteIssue(issueId : string) {
    const { userId, orgId } = await auth();
  
    if (!userId || !orgId) {
        return {status : 403, success : "false" , message : "Access denied"};
    }
  
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
        return {status : 403, success : "false" , message : "User not found"};
    }
  
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });
  
    if (!issue) {
        return {status : 403, success : "false" , message : "Issue not found"};
    }
  
    if (
      issue.reporterId !== user.id &&
      !issue.project.organizationId.includes(user.id)
    ) {
        return {status : 403, success : "false" , message : "You don't have permission to delete this issue"};
      
    }
  
    await prisma.issue.delete({ where: { id: issueId } });
  
    return { status : 200, success : "true", message :"Issue Deleted Successfully"};
  }
  
  export async function updateIssue(issueId : string, data : Issue) {
    const { userId, orgId } = await auth();
  
    if (!userId || !orgId) {
        return {status : 403, success : "false" , message : "Access denied"};
    }
  
    try {
      const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { project: true },
      });
  
      if (!issue) {
        return {status : 403, success : "false" , message : "Issue not found"};;
      }
  
      if (issue.project.organizationId !== orgId) {
        return {status : 403, success : "false" , message : "Forbidden"};
      }
  
      const updatedIssue = await prisma.issue.update({
        where: { id: issueId },
        data: {
          status: data.status,
          priority: data.priority,
        },
        include: {
          assignee: true,
          reporter: true,
        },
      });
  
      return {status : 200, success : "true" , message : "Updated Successfully", data : updatedIssue};
    } catch (error) {
        return {status : 500, success : "false" , message : "Error updating issue"};
    }
  }