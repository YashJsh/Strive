"use client"

import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react';
import React from 'react'

const UserMenuButton = () => {
  return <UserButton>
        <UserButton.MenuItems>
            <UserButton.Link 
                label = "My Organizations"
                labelIcon = {<ChartNoAxesGantt size={15}/>}
                href = "/onboarding"
            />
        </UserButton.MenuItems>
    </UserButton>
}

export default UserMenuButton;