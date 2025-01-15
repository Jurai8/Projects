import { useEffect, useState, useCallback } from "react"
import { firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore"; 

// this function returns all the details on a word/translation
export default function useFetchVocab(user) {
    // make the arg the users info?
    const [error, setError] = useState(null)
    const [wordInfo, setWordInfo] = useState("")

    // useCallback prevents the function from changing every render, unless the value in the dependancy changes
    const getInfo = useCallback(async (listName, word) => {
        console.log("listname: ", listName, "word: ", word?.translation);
    
        try {
            if (!word || typeof word !== "object") {
                setError(true);
                throw new Error("word is undefined, null, or not an object");
            }
    
            if (!word.native || !word.translation) {
                setError(true);
                throw new Error("word.native or word.translation is undefined");
            }
    
            const q = query(
                collection(firestore, "Users", user.uid, listName),
                where("word", "==", word.native),
                where("translation", "==", word.translation)
            );
    
            const querySnapshot = await getDocs(q);

            let retrievedWord

            querySnapshot.forEach((doc) => {
                retrievedWord = doc.data();
                setWordInfo(retrievedWord);
            });   

           
            console.log("getInfo: ", retrievedWord)
            return retrievedWord;
            
            

        } catch (error) {
            setError(true);
            console.error("Function getInfo: ", error);
        }

      }, [user]);



    // make sure user is authenticated
    useEffect(() => {
        if (!user) {
            setError(true)  
        }

    }, [user])


    // make sure to return the functions or states themselves
    return { user, getInfo, error}
}