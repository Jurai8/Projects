

import { useState } from 'react';
import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, doc, updateDoc, query, where
} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, updateProfile,} from "firebase/auth";


export async function checkUser(username, email) {
    try {
        const res = await fetch('/checkUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email }),
          });
          const data = await res.json();
          
          console.log("Request sent successfully")
          return data;
    } catch (error) {
        console.log("Error sending request")
    }
}

export function CheckPasswordStrength(password) {
    function hasNumber(userString) {
        return /\d/.test(userString);
      }

    function hasUppercase(userString) {
        return /[A-Z]/.test(userString);
      }

    function hasSpecialChars(userString) {
        return /[!@#$()]/.test(userString);
      }

    function checkForChars(userString) {
        return /[a-z]/i.test(userString)
    }

    function checkForUnmentionedChars(userString) {
        for (let i = 0; i < userString.length; i++) {
            if (!hasNumber(userString[i]) && !hasSpecialChars(userString[i]) && !checkForChars(userString[i])) {
                return false;
            }
        }

        return true;
    }

    let errorMessage = {
        isValid: true,
        errors: []
    };

    // must contain:
    // 7 chars minimun
    if (password.length < 7) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password cannot be shorter than seven character");
    }
    // at least one number
    if (!hasNumber(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password must contain at least one number");
    }
    // upper case letter
    if (!hasUppercase(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password must contain an uppercase letter")
    } 

    // special char: !, @, #, $, ()
    if (!hasSpecialChars(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password must contain at least one special character")
    }

    // if contains anything besides theses warn user
    if (!checkForUnmentionedChars(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password should not contain any spaces. It should only contain what was specified before");
    }

    return errorMessage;
}

// TODO: word checker - is it a noun?



// * for the vocabtest
export async function FetchVocab () {
    const vocabList = [];

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        // get vocab 
        try {
            const getVocabdocs = await getDocs(collection(firestore, "Users", userId, "Vocablist 1")); 

            getVocabdocs.forEach((doc) => {
                vocabList.push({
                    native: doc.data().word,
                    translation: doc.data().translation
                });
            });
        } catch (error) {
            console.error("could not get vocab for test");
        }
        
        // how to return a randomized order of the array?
        return vocabList;
    } else {
        console.error("User not logged in");
    }
}

// check if the word is a noun
// TODO: implement in vocablist.js
export const NounChecker = (string) => {
    const articles = ["der", "die", "das"]
    // remove any spaces on the side
    console.log("Before: ", string)

    let word = string.trim()

    // take the first 3 letters from the word as a seperate string and convert to lower case
    const article = word.slice(0, 3).toLowerCase();
    console.log("Article: ", article)

     // if the string does not match (der,die,das)
    if (!articles.includes(article)) {
        // return false
        console.log("No change:", word.toLowerCase());
        return word.toLowerCase();
    }

    if (articles.includes(article)) {
        // get the rest of the word
        word = word.slice(3)
        // remove any spaces behind the first letter
        word = word.trim()
        // capitalize the first letter
        word = capitalizeFirstLetter(word)

        // concatonate the lowercase article + " " + captilized word
        // return the final version of the word
        const newWord = article + " " + word
        console.log("After: ", newWord)
        return article + " " + word
    }
}

function capitalizeFirstLetter(string) {
    const word = string.toLowerCase()

    // capitalize first letter and combine with rest of word
    return word.charAt(0).toUpperCase() + word.slice(1);
  };





// TODO:
// ! not necessary
    // hide words
        // button = hide
            // dropdown = native/ translation
            // if translation hide translation column
            // if native hide native column

    // Logout user