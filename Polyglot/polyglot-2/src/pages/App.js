import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 
import {useState, useEffect} from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SignUp from "./SignUp.js";
import Heft from "./Heft.js";
import MyButton from "../components/Button";
import Test from "./Test.js"

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
          <Routes> 
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/" element={<Home />} /> 
            <Route path="/heft" element={<Heft />} />
            <Route path="/test" element={<Test />} /> 
          </Routes> 
        </Router> 

        <h1 id="username"> {username ? username : "sign in"} </h1>
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
