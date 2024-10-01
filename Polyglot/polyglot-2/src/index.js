import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './pages/App';
import ErrorPage from './pages/ErrorPage';
import VocabLists from './pages/VocabLists';
import TestLearner from './pages/Test';
import { IndexTest } from './pages/Test';
import Heft from './pages/Heft';
import SignUp from './pages/SignUp';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  
    errorElement: <ErrorPage />,
  },
  {
    path: "/vocablists",
    element: <VocabLists />,  
  },
  {
    path: "/test",
    element: <TestLearner />, // Default element for /test
    children: [
      {
        path: "index", // /test/index
        element: <IndexTest />,
      },
    ],
  },
  {
    path: "/heft",
    element: <Heft />,  
    // use loader
  },
  {
    path: "/signup",
    element: <SignUp />,  
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// ! old version
/* 
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
      <Route path="/vocablists" element={<VocabLists />}/>
      <Route path="/test">
        <Route index element={<IndexTest />}/>
        <Route path=":testName" element={<TestLearner />}/>
      </Route>
    </Routes> 
  </Router> 
*/