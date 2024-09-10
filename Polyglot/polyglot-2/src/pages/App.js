import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 
import { Button } from "@mui/material";
import {useState, useEffect} from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SignUp from "./SignUp.js";
import { SignOut } from "../components/MyEventHandlers.js";
import Heft from "./Heft.js";
import VocabLists from "./VocabLists.js";
import MyButton from "../components/Button";
import TestLearner,{IndexTest} from "./Test.js"


function App() {
  const [username, setUsername] = useState(null);

  const auth = getAuth();

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
       <Router> 
          <MyButton to="" /> 
          <MyButton to="heft" /> 
          <MyButton to="signup" /> 
          <MyButton to="test" /> 
          <MyButton to="vocablists" /> 
          <Routes> 
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/" element={<Home />} /> 
            <Route path="/heft" element={<Heft />} />
            <Route path="/vocablists" element={<VocabLists/>}/>
            <Route path="/test">
              <Route index element={<IndexTest />}/>
              <Route path=":testName" element={<TestLearner />}/>
            </Route>
          </Routes> 
        </Router> 

        <section id="username"> {username  ?
          <div style={{display: 'flex'}}>
            <h1>{username}</h1>
            <Button onClick={SignOut}>Sign out</Button>
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

export default App;
