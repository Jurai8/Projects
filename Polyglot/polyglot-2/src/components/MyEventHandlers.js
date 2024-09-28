

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



/* say the user wants to view a specific vocab list
   onclick event, take the string of the button they clicked on
   copy that string onto the user path
    then display the vocab list
*/

// in the future: set a limit to the number of lists per user

// string = vocablist name will be passed to this func, onclick event
// use this function when asking user which list they want to view
// then pass rows to Table.js
export async function DisplayVocabList(collectionName) {
    const auth = getAuth();
    const user = auth.currentUser; 

    // pass an object (word and translation in one obj) into the array?
    if (user) {
        const userId = user.uid;
        const vocabulary = [];
        // path to subcollection
        const querySnapshot = await getDocs(collection(
            firestore, "Users", userId, collectionName
        ));

        querySnapshot.forEach((doc) => {
            // add each wordpair into the array
            console.log(`data: ${doc.data().word}`);

            vocabulary.push({
                word: doc.data().word,
                translation: doc.data().translation
            });
        });

       return vocabulary;
    } else {
        console.error("user not signed in");
    }
}


// ! for the vocabtest
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



// "delete" collection
// show option to delete with right click, on collection button within    collection drawer/ sidebar







// fuction if Vocab_Lists? == false, return false.

// TODO:
    // hide words
        // button = hide
            // dropdown = native/ translation
            // if translation hide translation column
            // if native hide native column

    // Logout user