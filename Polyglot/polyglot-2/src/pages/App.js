import { Routes, Route } from 'react-router-dom'
import SignUp, { SignIn } from "./SignUp.js";
import Heft from "./Heft.js";
import Home from './Home.js';
import VocabLists from "./VocabLists.js";
import {TestLearner, SelectTest, TestIndex} from "./Test.js"
import { AuthProvider } from '../hooks/useAuth.js';
import { ProtectedRoute } from '../components/ProtectedRoute.js';
import Layout from '../components/Layout.js';
import Profile from './Profile.js';


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
                     <TestIndex />
                  </ProtectedRoute>
                }
              />

              <Route
                path="select-list" 
                element={<ProtectedRoute><SelectTest /></ProtectedRoute>}
              />

              <Route
                path="schedule-test/select-list" 
                element={<ProtectedRoute><SelectTest /></ProtectedRoute>}
              />

              <Route 
                path=":testName" 
                element={<ProtectedRoute><TestLearner /></ProtectedRoute>} 
              />  

            </Route>
            
            {/* "/profile-[username]" */}
            <Route path="/profile" element={
                <Profile />
              }
            /> 
              
          </Route>
        </Routes>  
      </AuthProvider>

    </>
        
  );
}

export default App;
