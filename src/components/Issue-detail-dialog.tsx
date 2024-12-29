import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Issue } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useOrganization, useUser } from "@clerk/nextjs";
import { deleteIssue, updateIssue } from "../../actions/issues";
import { toast, Toaster } from "sonner";

interface IssueDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: any; // Replace Issue with the appropriate type
  onDelete: () => void;
  onUpdate: () => void;
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


  const {user} = useUser();
  const {membership} = useOrganization();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteIssues = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteIssue(issue.id);
      if (response.success && response.status== 200) {
        toast.success("Issue deleted successfully")
      }
    } catch (error) {
        toast.error("Error deleting issue")
    } finally{
        setDeleteLoading(false);
    }
      
    };
  
    const updateIssues = async() => {
        try {
            setUpdateLoading(true);
            const response = await updateIssue(issue.id, issue);
            if (response.success && response.status== 200) {
                toast.success("Issue updated successfully")
            }
        } catch(error) {

        }
            
        finally{
            setUpdateLoading(false)
        }
    }
    const canChange = user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  const handleGoToProject = () => {
    router.push(`/dashboard/project/${issue.projectId}`);
  }; 


  return (
    <div className="flex flex-col items-center text-center justify-center">
        <Toaster/>
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
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueDetailsDialog;
