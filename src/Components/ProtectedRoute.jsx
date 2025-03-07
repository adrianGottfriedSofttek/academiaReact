import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/userAuth";

export const ProtectedRoute =({children}) =>{
    
    const {user} =useAuth();
    if(!user) <Navigate to ={'/login'} />;
    return children;
}