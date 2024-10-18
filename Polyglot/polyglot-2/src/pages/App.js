import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Button } from "@mui/material";
import {useState, useEffect, useMemo, useRef} from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SignUp, { SignIn } from "./SignUp.js";
import { SignOut } from "../components/MyEventHandlers.js";
import Heft from "./Heft.js";
import VocabLists from "./VocabLists.js";
import MyButton from "../components/Button";
import TestLearner,{IndexTest} from "./Test.js"
import { Learner } from "../components/Learner.js";
import ErrorPage from './ErrorPage.js';
import usePersistState from '../components/Hooks.js';


// TODO make sure the data (/state?) persists after refresh
// * how to keep track of whether the user is signed in or not, without using state?

// * probably use onauthstatechange?
function App() {
  // remember if user is already signed in after refresh
  const [LoggedIn, setLoggedIn] = usePersistState(false, 'user7');

  const setStatus = (bool) => setLoggedIn(bool);

  /* <Route path="/" element={
    <Home signedIn={signedIn} setUserState={setUserState} />
  }/> */
  return (
    <>
      <Routes> 
        <Route path="/" element={
          <Home signedIn={LoggedIn} setStatus={setStatus} />
        }/> 

        {/* signin & signup */}
        <Route path="/signup" element={
          <SignUp setStatus={setStatus}/>
        }/> 
        <Route path="/signin" element={
          <SignIn setStatus={setStatus}/>
        }/> 

        {/* vocablist */}
        
        
        <Route path="/vocablists" element={<VocabLists />}/>
        {/* Dynamic Page for individual lists */}
        <Route path="/vocablists/:list" element={<Heft />}/> 

        <Route path="/test">
          <Route index element={<IndexTest />}/>
          <Route path=":testName" element={<TestLearner />}/>
        </Route>
      </Routes>  
    </>
        
  );
}


function Home({ signedIn, setStatus }) {
  const [username, setUsername] = useState(null);
  const auth = getAuth();
  const user = new Learner();


  const signOut = () => {
    window.location.reload(true);
    setStatus(false);
    user.SignOut();
  }

  useEffect(() => {
    const showUsername = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName);
      } else {
        setUsername(false);
      }
    });

    return () => showUsername();
  }, [auth]);

  const input = useRef();

  const wordClassifier = (word) => {
    const articles = ['der', 'die', 'das'];
    const regex = new RegExp(articles.join( "|" ), "i");

    let newWord;
    let bool = false;

    function lowercaseFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    };

    function capitalizeFirstLetter(string) {
      // get the article with the space ' ' 
      const article = string.slice(0,4);

      // combine the article with the capitalized word
      return article + string.charAt(4).toUpperCase() + string.slice(5);
    };

    function addSpace(string) {
      const ogArticle = string.slice(0,3);

      const word = string.slice(3);
      
      const newWord = ogArticle + ' ' + word;

      return newWord;
    }

    // TODO: rewrite using regex

    // check if it's a noun
    articles.forEach(article => {
        if (word.includes(article)) {

            // change the article to lowercase
            newWord = lowercaseFirstLetter(word);

            // check for space between article and word 
            if(newWord[3] !== ' ') {
              console.log("Before: ", newWord);
              newWord = addSpace(newWord);
            } 

            // change the first letter of the noun to uppercase
            newWord = capitalizeFirstLetter(newWord);

            console.log("After: ", newWord);
            bool = true;
            return;
          }
    });
        
    // if it's any other word change the first letter to lowercase
    if (bool) {
      return
    }
    console.log("no noun: ", newWord = lowercaseFirstLetter(word)) 
    return
}



  return (
    <div className="App">
      {signedIn ? (
          <>
          <MyButton to="" /> 
          <MyButton to="heft" /> 
          <MyButton to="signup" /> 
          <MyButton to="test" /> 
          <MyButton to="vocablists" />

            <h1>Polyglot</h1>

            <form>
             <input type='text' ref={input}></input>
             
             <input type='submit' onClick={(event) =>{
              event.preventDefault();
              wordClassifier(input.current.value)
             }}>
              </input>
            </form>

            <section id="username">
              {username ? (
                <div style={{ display: 'flex' }}>
                  <h1>{username}</h1>
                  <Button onClick={() => signOut()}>
                      Sign out
                  </Button>
                </div>
              ) : null}
            </section>
          </>
        ) : (
          <>
            <h1>Polyglot</h1>
            <h2>Welcome</h2>
            
            <Link to="/signin">
              <Button>sign in</Button>
            </Link>
            <Link to="/signup">
              <Button>sign up</Button>
            </Link>
            <Button onClick={() => signOut()}>
                Sign out
             </Button>
          </>
      )}
    </div>
  );
}


export default App;
