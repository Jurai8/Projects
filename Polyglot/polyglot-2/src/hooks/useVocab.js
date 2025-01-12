import { useEffect, useState } from "react"
import { useAuth } from "useAuth.js"
import { firestore } from "firebase-admin";
import { 
    setDoc, addDoc, collection, getDocs, getDoc, doc, updateDoc, query, where,
    deleteDoc,
} from "firebase/firestore"; 

// this function returns all the details on a word/translation
export default function useVocab(user) {
    // make the arg the users info?
    const [error, setError] = useState(null)
    const [wordInfo, setWordInfo] = useState("")

    async function getVocab(listName, word) {
        // get word from db
        //!! is "word" one word or an obj
        const q = query(collection(firestore, "Users", user.uid, listName,), where("word", "==", word));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        
        // should contain all the fields: word, translation, pos, definition
        const retrievedWord = doc.data();

        setWordInfo(retrievedWord)
        });

        return wordInfo;
    }

    // check for any issues with user
    useEffect(() => {
        if (!user) {
            setError(true)
        }
    }, [user])

    // make sure to return the functions or states themselves

    return {getVocab, error}
}