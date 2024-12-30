import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { deleteIssue, updateIssue } from "../../actions/issues";
import { toast, Toaster } from "sonner";
import { BarLoader } from "react-spinners";
import statuses from "../../data.json";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-Avatar";
import { User } from "@prisma/client";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

interface IssueDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: any; // Replace Issue with the appropriate type
  onDelete: () => void;
  onUpdate: (updateResponse : any) => void;
  borderColor: string;
}

const IssueDetailsDialog: React.FC<IssueDetailsDialogProps> = ({
  isOpen,
  onClose,
  issue,
  onDelete,
  onUpdate,
  borderColor,
}) => {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith("/project/");
  const router = useRouter();

  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  const { user } = useUser();
  const { membership } = useOrganization();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteIssues = async (IssueId : string) => {
    try {
      if (window.confirm("Are you sure you want to delete this issue?")) {
        setDeleteLoading(true);
        const response = await deleteIssue(IssueId);
        if (response.success && response.status == 200) {
          router.refresh();
          onClose()
          toast.success("Issue deleted successfully");
        }
      }
    } catch (error) {
      toast.error("Error deleting issue");
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateIssues = async (IssueId : string, {priority , status} : any) => {
    try {
      setUpdateLoading(true);
      const response = await updateIssue(IssueId, {priority, status});
      if (response.success && response.status == 200) {
        setStatus(response.data?.status);
        setPriority(response.data?.priority);
        router.refresh();
        onClose()
        toast.success("Issue updated successfully");
      }
    } catch (error) {
      toast.error("Error updating issue");
    } finally {
      setUpdateLoading(false);
    }
  };

  const canChange =
    user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  const handleStatusChange = async (newStatus: string) => {
    console.log("New Status is : ", newStatus);
    setStatus(newStatus);
    await updateIssues(issue.id, { priority: issue.priority, status: newStatus });
   
  };
  const handlePriorityChange = async (newPriority: string) => {
    console.log("New Priority is : ", newPriority);
    setPriority(newPriority); // Update the state for UI consistency
    console.log("Consoling before update : ", issue.priority);
  
    // Pass the new values explicitly
    await updateIssues(issue.id, { priority: newPriority, status: issue.status });
    console.log("AFter update priority is : ", newPriority);
  };

  const handleGoToProject = () => {
    router.push(`/dashboard/project/${issue.projectId}?sprint=${issue.sprintId}/`);
  };

  return (
    <div className="flex flex-col items-center text-center justify-center">
      <Toaster />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`border-t-2 ${borderColor} rounded-lg`}>
          <DialogHeader>
            <div>
              <DialogTitle>{issue.title}</DialogTitle>
            </div>
            {!isProjectPage && (
              <Button
                asChild
                className="flex justify-center"
                variant="ghost"
                onClick={handleGoToProject}
              >
                Go To Project
              </Button>
            )}
          </DialogHeader>
          {(updateLoading || deleteLoading) && (
            <BarLoader className="mt-4" width="full" color="white" />
          )}
          <div className="flex flex-col gap-4">
            <div>
              <Select
                value={priority}
                onValueChange={handlePriorityChange}
                disabled={!canChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority, index) => (
                    <SelectItem key={index} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start">
              <h3 className="text-sm font-semibold px-3">Description</h3>
              <MDEditor.Markdown
                className="w-full rounded  border"
                source={issue.description ? issue.description : "--"}
              />
            </div>
            <div className="flex items-center text-xs justify-between px-3 font-semibold">
              <div className="flex items-center gap-2">
                <h4>Assignee : </h4>
                <UserAvatar user={issue.assignee} />
              </div>
              <div className="flex items-center gap-2">
                <h4>Reporter : </h4>
                <UserAvatar user={issue.reporter} />
              </div>
            </div>
            {canChange && (
              <Button
                onClick={() => {
                  deleteIssues(issue.id);
                }}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting" : "Delete"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueDetailsDialog;
