

import { useState } from 'react';
import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, doc, updateDoc, query, where
} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, updateProfile,} from "firebase/auth";





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