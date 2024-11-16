import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If not signed in, redirect to the login page
  if (!user) return <Navigate to="/signin" replace />;

  
  return children;
};