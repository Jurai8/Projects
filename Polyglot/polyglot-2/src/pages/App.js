import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 

import Heft from "./pages/Heft";

function App() {
  return (
    <div className="App">
       <Router> 
          <Button to="" /> 
          <Button to="about" /> 
          <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/about" element={<About />} /> 
          </Routes> 
        </Router> 
    </div>
  );
}

export default App;
