import { Span } from "next/dist/trace";
import { Suspense } from "react";

interface ProjectLayout{
    children : React.ReactNode
}

const Layout = ({children} : ProjectLayout) =>{
    return <div className="mx-7">
        <Suspense fallback= {<span className="w-full text-center">Loading Project</span>}>
            {children}
        </Suspense>
         
    </div>
}
export default Layout;