import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <Box className='loading-icon-position'>
      <CircularProgress />
    </Box>
  );

  // If not signed in, redirect to the login page
  if (!user) return <Navigate to="/signin" replace />;

  
  return children;
};