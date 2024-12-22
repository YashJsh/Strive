interface MainLayout{
    children : React.ReactNode
}

const Layout = ({children} : MainLayout) =>{
    return <div>
         {children}
    </div>
}
export default Layout;