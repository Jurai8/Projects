import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Learner } from "../functions/Learner";
import { Button } from "@mui/material";
import MyButton from "../components/Button";
import { useAuth } from '../hooks/useAuth';


export default function Home() {
    const [username, setUsername] = useState(null);
    const auth = getAuth();
    const { user, logout} = useAuth();
  
  
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
  
      // remove all spaces
      const newWord = word.replace(/ /g, "");
      
      // break up the word
      const article = word.slice(0,3);
      let modWord = word.slice(3)
  
      function lowercaseFirstLetter(string) {
          return string.charAt(0).toLowerCase() + string.slice(1);
      };
  
      function capitalizeFirstLetter(string) {
        const word = string.toLowerCase()
  
        // capitalize first letter and combine with rest of word
        return word.charAt(0).toUpperCase() + word.slice(1);
      };
  
      // TODO: if there's already a space don't add one
  
  
      // if the word has an article
      if (regex.test(article)) {
        let finWord;
  
        const article = word.slice(0,3);
        
        // ensure entire article is lowercase
        const newArticle = article.toLowerCase();
      
        // ensure noun is capitalized
        modWord = capitalizeFirstLetter(modWord);
  
        if (word[3] === ' ') {
          finWord = newArticle + modWord;
        } else {
          finWord = newArticle + ' ' + modWord;
        }
        
  
        console.log("before: ", word);
        console.log("After: ", finWord);
        return;
  
      } else {
        // it's not a noun so use the regular word
        console.log("no noun: ", word.toLowerCase()) 
      }
          
  }
  
  
  
    return (
      <div className="App">
        {user ? (
            <>
              <p>Testing for test</p> 
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
                    <h1>Welcome {username}</h1>
                    <Button onClick={() => logout()}>
                        Sign out
                    </Button>
                  </div>
                ) : null}
              </section>
            </>
          ) : (
            <>
              <h1>Polyglot</h1>
              <h2>Hello There</h2>
              
              <Link to="/signin">
                <Button>sign in</Button>
              </Link>
              <Link to="/signup">
                <Button>sign up</Button>
              </Link>
            </>
        )}
      </div>
    );
  }
  