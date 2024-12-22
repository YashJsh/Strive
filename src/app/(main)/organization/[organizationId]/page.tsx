import React from 'react'

const Organization = async ({params} : {params : {organizationId : string}}) => {
  const { organizationId } = await params;
  return (
    <div className='px-10'>
        {organizationId}
    </div>
  )
}

export default Organization