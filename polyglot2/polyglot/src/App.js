import { 
  BrowserRouter as Router, Routes, 
  Route 
} from "react-router-dom"; 
import About from "./pages/Heft.js";


function App() {
  return (
    <div>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>

      <Router> 
        <MyButton to="" /> 
        <MyButton to="Heft" /> 
        <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/profile"
                element={<Heft />} /> 
        </Routes> 
      </Router> 
      
    </div>
  );
}

export default App;
