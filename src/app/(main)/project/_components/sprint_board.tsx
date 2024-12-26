"use client"

import { Sprint } from "@prisma/client";
import { Divide } from "lucide-react";
import { useState } from "react";
import SprintManager from "./sprint-manager";
import { sprintSchema } from "./page";

interface SprintBoardSchema{
    sprints : Sprint[],
    projectId : string,
    orgId : string
}

const SprintBoard = ({ sprints, projectId, orgId } : SprintBoardSchema) => {
    const [currentSprint, setCurrentSprint] = useState<Sprint>(
        sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
    )
    return <div>
        {/* Sprint Manager  */}
        <SprintManager
            sprint={currentSprint}
            setSprint = {setCurrentSprint}
            sprints = {sprints}
            projectId = {projectId}
        />

        {/* Kanban Board */}
    </div>
};

export default SprintBoard;
