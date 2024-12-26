"use server"

import { auth } from "@clerk/nextjs/server"
import { sprintSchema } from "@/app/(main)/project/_components/page";
import { prisma } from "@/lib/prisma";

type SprintData = typeof sprintSchema._type;

export async function createSprint({projectId, data} : {projectId: string, data: SprintData}){
    const { userId, orgId } = await auth();
    if(!userId || !orgId){
        return { success: false, message:"User is unauthenticated"}
    }
    const project = await prisma.project.findUnique({
        where : { 
            id : projectId
        }
    })
    if(!project ||project?.organizationId !== orgId){
        return { success: false, message:"Project not found"}
    }

    const sprints = await prisma.sprint.create({
        data : {
            name : data.name,
            startDate : data.startDate,
            endDate : data.endDate,
            status : "PLANNED",
            projectId : projectId
        }
    })

    return { success: true, message: "Sprint created successfully", data : sprints }

}


export async function updateSprintStatus(sprintId : string, newStatus : any){
    const { userId , orgId, orgRole } = await auth();
    if(!userId || !orgId){
        return { success: false, message:"User is unauthenticated"}
    }
    if(orgRole !== "org:admin"){
        return { success: false, message:"User is not authorized"}
    }


    try {
        const sprint = await prisma.sprint.findUnique({
            where : {
                id : sprintId
            },
            include : {
                project : true
            }
        })
        if(!sprint){
            return { status: 403, success: false, message:"Sprint Not found"}
        }
        if(sprint.project.organizationId!== orgId){
            return { status: 403, success: false, message:"Sprint not found"}
        }
        const now = new Date();
        const startDate = sprint.startDate;
        const endDate = sprint.endDate;

        if(newStatus === "ACTIVE" && (now < startDate || now > endDate)){
            return { status: 403, success: false, message:"Cannot start Sprint outside of its date range"}
        }
        if(newStatus === "COMPLETED" && sprint.status!== "ACTIVE"){
            return { status: 403, success: false, message:"Can't set and inactive sprint to Completed"}
        }

        const updateSprint = await prisma.sprint.update({
            where : {
                id : sprintId
            },
            data : {
                status : newStatus
            }
        })
        return { status : 200, success : true, message : "Sprint status updated successfully", data : updateSprint }
    } catch (error : any) {
        return { status: 500, success: false, message: error.message}
    }
}