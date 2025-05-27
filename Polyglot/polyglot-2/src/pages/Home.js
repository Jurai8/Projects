import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useAuth } from '../hooks/useAuth';

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
        <h2>Hello There</h2>
        
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
              <h1>Welcome {username}</h1>
              <Button onClick={() => logout()}>
                  Sign out
              </Button>
            </div>
          ) : null}
        </section>
      </>

    )

    function DisplayPage({ user, loading }) {

      if (loading || user === null) {
        console.log(user);
        
        return <div>Loading...</div>

      } else {
        if (user) {
          return SignedInPage 
        } else {
          return  SignedOutPage
        }
      }

    }

  
  
    return (
      <div className="home-page">
        <div>
          <DisplayPage user={user} loading={loading} />
        </div>
      </div>
    );
  }
  
  /* 
  loading &&  <div>Loading...</div>

        {user ? (
          SignedOutPage
        ) : (
          SignedInPage
        )}
          */