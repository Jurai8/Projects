import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button } from "@mui/material";
import {useState, useEffect, useRef} from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SignUp, { SignIn } from "./SignUp.js";
import { SignOut } from "../components/MyEventHandlers.js";
import Heft from "./Heft.js";
import VocabLists from "./VocabLists.js";
import MyButton from "../components/Button";
import TestLearner,{IndexTest} from "./Test.js"
import { Learner } from "../components/Learner.js";
import ErrorPage from './ErrorPage.js';


function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const auth = getAuth();
  const user = new Learner();

  const signOut = () => {
    window.location.reload(true); 
    setSignedIn(false);
    user.SignOut();
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName);
      } else {
        setUsername(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  

  return (
    <div className="App">

      {signedIn ? (
          <>
            <Router>  
            <nav>
              <Link to="/heft">
                <Button>Go to Heft</Button>
              </Link>
              <Link to="/signup">
                <Button>Go to SignUp</Button>
              </Link>
              <Link to="/signin">
                <Button>Go to SignIn</Button>
              </Link>
              <Link to="/test">
                <Button>Go to Test</Button>
              </Link>
              <Link to="/vocablists">
                <Button>Go to VocabLists</Button>
              </Link>
            </nav>
              
              <Routes> 
                <Route path="/" element={<App />} /> 
                {/* Sign Up and Sign In */}
                <Route path="/signup" element={<SignUp />} /> 
                <Route path="/signin" element={<SignIn />} /> 

                <Route path="/heft" element={<Heft />} />
                
                <Route path="/vocablists" element={<VocabLists />}/>
                {/* Dynamic Page for individual lists */}
                <Route path="/vocablists/:list" element={<Heft />}/> 

                <Route path="/test">
                  <Route index element={<IndexTest />}/>
                  <Route path=":testName" element={<TestLearner />}/>
                </Route>

                <Route path="*" element={<ErrorPage />} />
              </Routes> 
            </Router> 

            <h1>Polyglot</h1>

            <section id="username">
              {username ? (
                <div style={{ display: 'flex' }}>
                  <h1>{username}</h1>
                  <Button onClick={() => signOut()}>
                      Sign out
                  </Button>
                </div>
              ) : null}
            </section>
          </>
        ) : (
          <>
            <h1>Polyglot</h1>
            <h2>Welcome</h2>

            <Link to="/signin" state={{ user: signedIn}}>
              <Button>sign in</Button>
            </Link>
            <Link to="/signup" state={{ user: signedIn}}>
              <Button>sign up</Button>
            </Link>
          </>
      )}
    </div>
  );
}

//get all the vocab lists and pass it to vocablists

export default App;
