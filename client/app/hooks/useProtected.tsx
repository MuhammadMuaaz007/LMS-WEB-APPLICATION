import { redirect } from "next/navigation";
import userAuth from "./useAuth";
interface protectedProps{
    children:React.ReactNode
}
export default function Protected({children}:protectedProps){
    const isAuthenticated=userAuth();
    
    return isAuthenticated ? children :redirect("/")
}