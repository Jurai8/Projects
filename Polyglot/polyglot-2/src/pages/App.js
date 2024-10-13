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


// TODO make sure the data (/state?) persists after refresh
// * how to keep track of whether the user is signed in or not, without using state?

// * probably use onauthstatechange?
function App() {
  const [signedIn, setSignedIn] = useState(false);
  const setUserState = (bool) => setSignedIn(bool);

  /* <Route path="/" element={
    <Home signedIn={signedIn} setUserState={setUserState} />
  }/> */
  return (
    <>
      <Routes> 
        <Route path="/" element={
          <Home signedIn={signedIn} setUserState={setUserState} />
        }/> 

        {/* signin & signup */}
        <Route path="/signup" element={
          <SignUp setUserState={setUserState}/>
        }/> 
        <Route path="/signin" element={
          <SignIn setUserState={setUserState}/>
        }/> 

        {/* vocablist */}
        <Route path="/heft" element={<Heft />} />
        
        <Route path="/vocablists" element={<VocabLists />}/>
        {/* Dynamic Page for individual lists */}
        <Route path="/vocablists/:list" element={<Heft />}/> 

        <Route path="/test">
          <Route index element={<IndexTest />}/>
          <Route path=":testName" element={<TestLearner />}/>
        </Route>
      </Routes>  
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
          <MyButton to="" /> 
          <MyButton to="heft" /> 
          <MyButton to="signup" /> 
          <MyButton to="test" /> 
          <MyButton to="vocablists" />

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


export default App;
