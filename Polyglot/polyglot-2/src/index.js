import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App';
import { SignIn } from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import VocabLists from './pages/VocabLists';
import TestLearner from './pages/Test';
import { IndexTest } from './pages/Test';
import Heft from './pages/Heft';
import SignUp from './pages/SignUp';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);

/* 
<Routes>
  <Route path="/*" element={<App />} />
</Routes>
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// ! old version
/* 
  <Router> 
    
    <Routes> 
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/" element={<Home />} /> 
      <Route path="/heft" element={<Heft />} />
      <Route path="/vocablists" element={<VocabLists />}/>
      <Route path="/test">
        <Route index element={<IndexTest />}/>
        <Route path=":testName" element={<TestLearner />}/>
      </Route>
    </Routes> 
  </Router> 
*/