import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 
import { Button } from "@mui/material";
import {useState, useEffect, useRef} from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SignUp from "./SignUp.js";
import { SignOut } from "../components/MyEventHandlers.js";
import Heft from "./Heft.js";
import VocabLists from "./VocabLists.js";
import MyButton from "../components/Button";
import TestLearner,{IndexTest} from "./Test.js"
import { Learner } from "../components/Learner.js";


function App() {
  const [username, setUsername] = useState(null);
  const auth = getAuth();
  const user = new Learner();

  const signOut = () => {
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
      <MyButton link="heft">Heft</MyButton>
      <MyButton link="signup">SignUp</MyButton>
      <MyButton link="test">Test</MyButton>
      <MyButton link="vocablists">Vocab Lists</MyButton>

      <h1>Polyglot</h1>

      <section id="username"> {username  ?
        <div style={{display: 'flex'}}>
          <h1>{username}</h1>
          <Button onClick={() => user.SignOut()}>Sign out</Button>
        </div> 
        // TODO: 
          // change to button
          // onclick, route to signInpage
        : "sign in"} 
      </section>
    </div>
  );
}

// home page
export function Home () {
  return (
    <h1>Hello</h1>
  )
}

//get all the vocab lists and pass it to vocablists

export default App;
