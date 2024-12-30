"use client";

import { Sprint, SprintStatus } from "@prisma/client";
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
import { useRouter } from "next/navigation";
import { updateSprintStatus } from "../../../../../actions/sprints";
import { toast, Toaster } from "sonner";

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
  const canEnd = status === "ACTIVE";

  const handleSprintChange = (value: string) => {
    const selected = sprints.find((s) => s.id === value);
    setSprint(selected);
    setStatus(selected?.status as "PLANNED" | "ACTIVE" | "COMPLETED");
    router.replace(`/project/${projectId}`, undefined);
  };

  const updateSprint = async (sprintId: string, Status: SprintStatus) => {
    try {
      setLoading(true);
      const response = await updateSprintStatus(sprintId, Status);
      if (response.status === 200) {
        setSprint(response.data);
        toast.success("Status Updated");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error updating Status");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: SprintStatus) => {
    updateSprint(sprint.id, newStatus);
  };

  const getStatusCheck = () => {
    if (status === "COMPLETED") {
      return "Sprint Ended";
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  return (
    <>
      <div className="flex gap-2">
        <Toaster />
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="w-full border bg-[#E1E1E1] text-black">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => {
              return (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name} ({format(sprint.startDate, "mm-dd-yyyy")} to{" "}
                  {format(sprint.endDate, "mm-dd-yyyy")})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            variant="destructive"
            className="bg-yellow-600 hover:bg-yellow-800 font-semibold text-white"
            disabled={loading}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            className="bg-red-600 hover:bg-red-800 font-semibold text-white"
            variant="destructive"
            disabled={loading}
          >
            End Sprint
          </Button>
        )}
      </div>
      {getStatusCheck() && (
        <Badge className="mt-2 self-start ">{getStatusCheck()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
