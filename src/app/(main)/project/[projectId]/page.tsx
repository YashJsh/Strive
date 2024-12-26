import React from "react";
import { GetProject } from "../../../../../actions/project";
import { notFound } from "next/navigation";
import SprintCreationForm from "../_components/page";
import SprintBoard from "../_components/sprint_board";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
  const projectId = await params.projectId;
  const project = await GetProject(projectId);
  console.log(project);
  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-semibold">Sprint Section</h1>
      <SprintCreationForm  
        projectTitle = {project.data?.name}
        projectId = {project.data?.id}
        projectKey = {project.data?.key}
        sprintKey = {project.data?.sprints.length + 1}
        />
      {project.data.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.data.sprints}
          projectId={project.data.id}
          orgId={project.data.organizationId}
        />
      ) : (
        <div>No sprints yet</div>
      )}
    </div>
  );
};

export default ProjectPage;
