import React from 'react'
import { getOrganization } from '../../../../../actions/organization';
import { OrganizationSwitcher } from '@clerk/nextjs';
import OrganizationSwitch from '@/components/organizationSwitcher';
import ProjectList from './_components/project-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Organization = async ({params} : {params : {organizationId : string}}) => {
  const { organizationId } = await params;
  const org = await getOrganization(organizationId);;
  if(!org){
    return <div>Organization not found</div>
  }
  const id = (await org.organization)?.id;
  return (
    <div className='px-7'>
        <div className='flex justify-between pt-3'>
          <h1 className='text-5xl font-bold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent '>{(await org.organization)?.name}</h1>
          <div className='flex gap-4'>
            <Button asChild className='text-base font-semibold'><Link href={"/project/create"}>Create Project</Link></Button>
            <OrganizationSwitch/>
          </div>
          
        </div>
        <div className='mt-4  gap-4'>
          <ProjectList orgId ={id}/>
        </div>
    </div>
  )
}

export default Organization