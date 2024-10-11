import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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
  const setUserState = (bool) => setSignedIn(bool);

  /* <Route path="/" element={
    <Home signedIn={signedIn} setUserState={setUserState} />
  }/> */
  return (
    <>
    <BrowserRouter>
      <Routes> 
        <Route path="/signin" element={<SignIn setUserState={setSignedIn} />} />  
      </Routes>
    </BrowserRouter>

      <h1>Hello</h1>

      <Link to="/signin">
        <Button>sign in</Button>
      </Link>
    </>
        
  );
}


function Home({ signedIn, setUserState }) {
  const [username, setUsername] = useState(null);
  const auth = getAuth();
  const user = new Learner();

  const signOut = () => {
    window.location.reload(true); 
    setUserState(false);
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

/*

<Routes> 
        
        <Route path="/signup" element={
          <SignUp setUserState={setUserState}/>
        }/> 
        <Route path="/signin" element={
          <SignIn setUserState={setUserState}/>
        }/> 

        <Route path="/heft" element={<Heft />} />
        
        <Route path="/vocablists" element={<VocabLists />}/>
        {/* Dynamic Page for individual lists 
        <Route path="/vocablists/:list" element={<Heft />}/> 

        <Route path="/test">
          <Route index element={<IndexTest />}/>
          <Route path=":testName" element={<TestLearner />}/>
        </Route>

        
      </Routes>  
      
      <h1>Hello</h1>

      <Link to="/signin">
        <Button>sign in</Button>
      </Link>
*/

export default App;
