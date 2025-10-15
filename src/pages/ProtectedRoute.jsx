import { useNavigate, Outlet } from "react-router"; // Use "react-router-dom" for modern projects
import { useEffect } from 'react';
import { useFirebase } from '../context/FireBase.jsx'; // Assuming this hook provides the auth state

const ProtectedRoute = () => {
    const navigate = useNavigate();
    // Assuming useFirebase returns { user, isLoading }
    const { isLoggedIn} = useFirebase();
    
    
    // 1. Check for authentication status and redirect
    useEffect(() => {
        // If authentication check is complete AND there is no user, redirect to login
        if (!isLoggedIn) {
            navigate('/login', { replace: true }); // 'replace: true' prevents going back to the protected route
        }
    }, [isLoggedIn]);

    

    // 3. If authentication is complete AND user exists, render the protected content
    if (isLoggedIn) {
        return <Outlet />;
    }
    
    // 4. Fallback: If we got here, we're not loading and there's no user, but the redirect in useEffect is handling it.
    // We can return null, but typically the useEffect will handle the flow.
    return null;
};

export default ProtectedRoute;
