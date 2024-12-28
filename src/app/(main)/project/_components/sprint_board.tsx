"use client";

import { Issue, IssueStatus, Sprint } from "@prisma/client";
import { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import status from "../../../../../data.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./createIssue";
import { getIssuesForSprint } from "../../../../../actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/issueCard";
import { toast, Toaster } from "sonner";



interface SprintBoardSchema {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
}

const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardSchema) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
  );
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>();
  const [loading, setLoading] = useState(false);

  const onDragEnd = async (result : any) => {
    if(currentSprint.status === "PLANNED"){
      toast.warning("Start the sprint to update the board");
    }
    if(currentSprint.status === "COMPLETED"){
      toast.warning("Cannot move issues to completed sprint");
    }
    const { destination, source } = result;
    if (!destination) return;
    if (destination.dropableId === source.dropableId && destination.index === source.index) return;
    const newOrderedData = [...issues]
    const sourceList = newOrderedData.filter(
      (list) =>list.status === source.droppableId
    );
    const DestinationList = newOrderedData.filter(
      (list) =>list.status === destination.droppableId
    );
    if(source.droppableId === destination.droppableId){
      const reorderCard = reorder(
        sourceList,
        source.index,
        destination.index
      )
      reorderCard.forEach((card, i)=>{card.order = i;})
    }
    const sortedIssues = newOrderedData.sort((a,b)=>a.order - b.order);
  };

  const reorder = (list:Issue[], startIndex : number, endIndex : number)  =>{
    const result =  Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = () => {
    //fetch issues again
    fetchIssues();
  };

  const fetchIssues = async () => {
    const response = await getIssuesForSprint(currentSprint.id);
    if (response.data) {
      setIssues(response.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchIssues().finally(() => {
      setLoading(false);
    });
  }, [currentSprint.id]);

  return (
    <div>
      <Toaster/>
      {/* Sprint Manager  */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {loading && <BarLoader className="mt-4" width="full" color="white" />}
      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 bg-black  p-4 rounded-lg">
          {status.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <h3 className="font-bold text-center">{column.name}</h3>
                  {issues
                    ?.filter((issue) => issue.status === column.key) // Ensure 'issues' is an array and filter correctly
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard issue={issue} />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        className="w-full font-semibold mt-2"
                        onClick={() =>
                          handleAddIssue(column.key as IssueStatus)
                        }
                      >
                        <Plus />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus as IssueStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
