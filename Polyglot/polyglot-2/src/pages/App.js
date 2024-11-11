import { Routes, Route, Link } from 'react-router-dom'
import { Button } from "@mui/material";
import {useState, useEffect, useRef} from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SignUp, { SignIn } from "./SignUp.js";
import Heft from "./Heft.js";
import Home from './Home.js';
import VocabLists from "./VocabLists.js";
import MyButton from "../components/Button";
import TestLearner,{IndexTest} from "./Test.js"
import { Learner } from "../functions/Learner.js";
import ErrorPage from './ErrorPage.js';
import { AuthProvider } from '../hooks/useAuth.js';
import { ProtectedRoute } from '../components/ProtectedRoute.js';
import Layout from '../components/Layout.js';


// TODO make sure the data (/state?) persists after refresh
// * how to keep track of whether the user is signed in or not, without using state?
// * probably use onauthstatechange?

function App() {
  // remember if user is already signed in after refresh

  return (
    <>
      <AuthProvider>
        <Routes> 
          <Route path="/" element={<Layout />}>
            {/* Home page */}
            <Route index element={
                <Home />
              }
            />

            {/* signin & signup */}
            <Route path="/signup" element={
                <SignUp />
              }
            /> 
            <Route path="/signin" element={
                <SignIn />
              }
            /> 

            {/* vocablist */}
            <Route path="/vocablists" element={
                <ProtectedRoute>
                  <VocabLists />
                </ProtectedRoute>
              }
            />

            {/* Dynamic Page for individual lists */}
            <Route path="/vocablists/:list" element={
                <ProtectedRoute>
                  <Heft />
                </ProtectedRoute>
              }
            /> 

            <Route path="/test">
              <Route index element={
                  <ProtectedRoute>
                     <IndexTest />
                  </ProtectedRoute>
                }
              />
              <Route path=":testName" element={
                  <ProtectedRoute>
                    <TestLearner />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>  
      </AuthProvider>

    </>
        
  );
}

export default App;
