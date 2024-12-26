"use client"

import { Sprint } from "@prisma/client";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SprintManagerInterface {
  sprint: Sprint;
  setSprint: any;
  sprints: Sprint[];
  projectId: string;
}

const SprintManager = ({
  sprint,
  setSprint,
  sprints,
  projectId,
}: SprintManagerInterface) => {
  const [status, setStatus] = useState(sprint.status);
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
    const canEnd = status === "ACTIVE";

    const handleSprintChange = (value : string) => {
      const selected = sprints.find((s)=> s.id === value);
      setSprint(selected);
      setStatus(selected?.status as "PLANNED" | "ACTIVE" | "COMPLETED");
    }   

    const getStatusCheck = () =>{
      if(status === "COMPLETED"){
        return "Sprint Ended"
      }
      if(status === "ACTIVE" && isAfter(now, endDate)){
        return `Overdue by ${formatDistanceToNow(endDate)}`
      }
      if(status === "PLANNED" && isBefore(now, startDate)){
        return `Starts in ${formatDistanceToNow(startDate)}`
      }
      return null;
    }

    return (
      <>
      <div className="flex gap-2">
      <Select value = {sprint.id} onValueChange = {handleSprintChange}>
        <SelectTrigger className="w-full border bg-[#E1E1E1] text-black">
          <SelectValue placeholder="Select Sprint" />
        </SelectTrigger>
      <SelectContent>
        {sprints.map((sprint)=>{
          return (
            <SelectItem key = {sprint.id} value={sprint.id}>
              {sprint.name} ({format(sprint.startDate, "mm-dd-yyyy")} to {format(sprint.endDate, "mm-dd-yyyy")})
            </SelectItem>
          )    
        })}
      </SelectContent>
    </Select>
    {canStart && (
      <Button className="bg-yellow-600 hover:bg-yellow-800 font-semibold text-white">Start Sprint</Button>
    )}
    {canEnd && (
      <Button>End Sprint</Button>
    )}
    </div>
    {getStatusCheck() && (
      <Badge className="mt-2 self-start ">{getStatusCheck()}</Badge>
    )}
    </>
  );
};

export default SprintManager;
