import React from 'react'
import { getProjects } from '../../../../../../actions/project'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteProject from './project-delete';

const ProjectList = async ({orgId} : any) => {
    const data = await getProjects(orgId);
    if(data.data?.length === 0){
        return (
            <div className="project-list flex  flex-col gap-4 justify-center text-center items-center">
                <h2 className="text-6xl font-semibold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent py-4">No projects found</h2>
                <Button asChild>
                    <Link href = {`/project/create`}>Create New</Link>
                </Button>   
            </div>
        )
    }
  return (
    <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 gap-4'>
        {data.data?.map((project) => {
            return (
                <Card key = {project.id}>
                    <CardHeader>
                        <CardTitle className='flex justify-between items-center'>
                            {project.name}
                            <DeleteProject projectId = {project.id} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm font-light mb-4'>{project.description}</p>
                        <Link className= "text-blue-600 tracking-tight " href = {`/project/${project.id}`}>View Project 
                        </Link>
                    </CardContent>
                </Card>
            )
        })}
    </div>
  )
}

export default ProjectList