import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useAuth } from '../hooks/useAuth';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


export default function Home() {
  const [username, setUsername] = useState(null);
  const { user, logout, loading} = useAuth();
  
  useEffect(() => {
    const showUsername = () => {

      if (user) {
        setUsername(user.displayName);
      } else {
        setUsername(false);
      }
    }

    showUsername();
  }, [user]);
  
  const SignedOutPage = (
    <>
      <h2>Welcome to Polyglot</h2>
      
      <Link to="/signin">
        <Button>sign in</Button>
      </Link>
      <Link to="/signup">
        <Button>sign up</Button>
      </Link>
    </>
  );

  const SignedInPage = (
    <>
      <section id="username">
        {username ? (
          <div style={{ display: 'flex' }}>
            <Typography variant='h4'>Welcome {username}</Typography>
          </div>
        ) : null}
      </section>
    </>

  )
  
  function DisplayPage({ user, loading }) {

    if (loading || user === null) {
      console.log(user);
      
      return (
        <Box className='loading-icon-position'>
          <CircularProgress className='' />
        </Box> 
      );

    } else {
      if (user) {
        return SignedInPage 
      } else {
        return  SignedOutPage
      }
    }

  }



  return (
    <div id="home-page-container">
      <div id="home-page">
        <DisplayPage user={user} loading={loading} />
      </div>
    </div>
  );
}
  
