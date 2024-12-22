"use client"

import { useOrganization, useUser } from "@clerk/nextjs"
import { BarLoader } from "react-spinners";
export const UserLoading = ()=>{
    const { isLoaded } = useOrganization();
    const { isLoaded : isUserLoaded } = useUser();
    if(!isLoaded || !isUserLoaded){
        return <BarLoader/>
    }
 }