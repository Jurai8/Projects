import { useEffect, useMemo, useState } from "react"
import { useAuth } from "./useAuth";
import { firestore } from "../firebase";
import { 
    setDoc, addDoc, collection, getDocs, getDoc, doc, updateDoc, query, where,
    deleteDoc,
} from "firebase/firestore"; 

// this function returns all the details on a word/translation
export default function useFetchVocab(user) {
    // make the arg the users info?
    const [error, setError] = useState(null)
    const [wordInfo, setWordInfo] = useState("")

    async function getInfo(listName, word) {

        console.log("listname: ", listName, "word: ", word.translation);

        try {
            if (!word || typeof word !== "object") {
                throw new Error("word is undefined, null, or not an object");
              }

              //! why can i see word in the console.log, but it's still undefined?
              if (!word.word || !word.translation) {
                throw new Error("word.word or word.translation is undefined");
              }

            const q = query(
                collection(firestore, "Users", user.uid, listName),
                where("word", "==", word.word),
                where("translation", "==", word.translation)
            );
    
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            
            // should contain all the fields: word, translation, pos, definition
            const retrievedWord = doc.data();
    
            setWordInfo(retrievedWord)
            });
    
            return wordInfo;
            
        } catch (error) {
            console.error("Function getInfo: ", error);
        }
        
    }

    // make sure user is authenticated
    useEffect(() => {
        if (!user) {
            setError(true)
        }
    }, [user])


    // make sure to return the functions or states themselves
    return { user, getInfo, error}
}