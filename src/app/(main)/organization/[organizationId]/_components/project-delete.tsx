"use client"
import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { Trash, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { deleteProject } from "../../../../../../actions/project";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

interface deleteProject{
    projectId: string
}

const DeleteProject : React.FC<deleteProject> = ({projectId}) => {
    const router = useRouter();

    const [deleting, setDeleting] = useState(false);

    const { membership } = useOrganization();
  if (membership?.role !== "org:admin") {
    return null;
  }

  const handleDelete = async ()=>{
    try {
        if(window.confirm("Are you sure you want to delete this project?")){
            setDeleting(true);
            const deleted = await deleteProject(projectId);
            if(deleted.status===200){
                router.refresh();
                toast.success("Project deleted successfully")
            }
        }
    } catch (error) {
       console.error(error) 
    } finally{
        setDeleting(false);
    }
  }

  return (
    <div>
        <Toaster/>
      <Button variant={"ghost"} disabled ={deleting} onClick={handleDelete}>
        <Trash className="w-2 h-2"/>
      </Button>
    </div>
  );
};

export default DeleteProject;
