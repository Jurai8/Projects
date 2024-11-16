import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Button } from "@mui/material";
import { useAuth } from '../hooks/useAuth';
import { NounChecker } from '../functions/MyEventHandlers';

export default function Home() {
    const [username, setUsername] = useState(null);
    const { user, logout} = useAuth();
    
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
  
    const input = useRef();
  
  
  
    return (
      <div className="App">
        {user ? (
            <>
              <p>Testing for test</p> 
              <form>
               <input type='text' ref={input}></input>
               
               <input type='submit' onClick={(event) =>{
                event.preventDefault();
                NounChecker(input.current.value)
               }}>
                </input>
              </form>
  
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
          ) : (
            <>
              <h1>Polyglot</h1>
              <h2>Hello There</h2>
              
              <Link to="/signin">
                <Button>sign in</Button>
              </Link>
              <Link to="/signup">
                <Button>sign up</Button>
              </Link>
            </>
        )}
      </div>
    );
  }
  