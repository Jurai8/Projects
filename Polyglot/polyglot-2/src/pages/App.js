import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 

import SignUp from "./SignUp.js";
import Heft from "./Heft.js";
import MyButton from "../components/Button";

function App() {
  return (
    <div className="App">
       <Router> 
          <MyButton to="" /> 
          <MyButton to="heft" /> 
          <MyButton to="signup" /> 
          <Routes> 
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/" element={<Home />} /> 
            <Route path="/heft" element={<Heft />} /> 
          </Routes> 
        </Router> 
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
