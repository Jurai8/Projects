import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 

import SignUp from "./SignUp.js";
import Heft from "./Heft.js";
import MyButton from "../components/Button";
import Test from "./Test.js"

function App() {
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
