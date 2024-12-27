"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { IssuePriority, IssueStatus } from "@prisma/client";

interface dataSchema{
    title : string,
    status : IssueStatus,
    description : string,
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
        where : {clerkUserId : orgId}
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