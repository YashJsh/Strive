import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./user-Avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./Issue-detail-dialog";

interface IssueCardProps {
  issue: any;
  showStatus?: boolean;
  onDelete?: (params?: any) => void;
  onUpdate?: (params?: any) => void;
}

                    //type issue
const priorityColor : any = {
  LOW: "border-green-500",
  MEDIUM: "border-yellow-500",
  HIGH: "border-orange-500",
  URGENT: "border-red-700",
};
const IssueCard = ({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
} : IssueCardProps) => {

    const [isDialogue, setDialogue] = useState(false);
    const created = formatDistanceToNow(new Date(issue.createdAt));
    const router = useRouter(); 

    const onDeleteHandler = (...params : any) => {
      router.refresh();
      onDelete(...params);
    };
    
    const onUpdateHandler = (...params : any) => {
      router.refresh();
      onUpdate(...params);
    };
    

  return (
    <div className="mt-2">
      <Card className="flex flex-col hover:shadow-white hover:shadow transition-shadow" onClick={()=>{setDialogue(true)}}>
        <CardHeader className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}>
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <Badge variant={"outline"} className="badge mt-1">{issue.priority}</Badge>
        </CardContent>
        <CardFooter className="flex justify-between">
          <UserAvatar user = {issue.assignee} />
          <div className="flex flex-col font-thin text-xs"><p className="font-semibold">Created :</p>
          <p className="font-medium">{created}</p></div>
        </CardFooter>
      </Card>
      {isDialogue && 
        <IssueDetailsDialog isOpen = {isDialogue} onClose = {()=>{setDialogue(false)}} issue = {issue} onDelete = {onDeleteHandler} onUpdate={onUpdateHandler}
        borderColor = {priorityColor[issue.priority]}
        />  
      }
    </div>
  );
};

export default IssueCard;
