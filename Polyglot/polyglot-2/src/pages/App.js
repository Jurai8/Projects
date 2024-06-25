import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 

import Heft from "./Heft.js";
import MyButton from "../components/Button";

function App() {
  return (
    <div className="App">
       <Router> 
          <MyButton to="" /> 
          <MyButton to="heft" /> 
          <Routes> 
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
