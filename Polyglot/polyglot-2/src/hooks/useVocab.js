import { useEffect, useState, useCallback } from "react"
import { firestore } from "../firebase";
import { collection, doc, updateDoc, getDocs, query, where } from "firebase/firestore"; 


// TODO: useContext. the functions will be used in multiple places

// Hook containing functions which read from the db
export default function useFetchVocab(user) {
    // make the arg the users info?
    const [error, setError] = useState(null);
    

    // make sure user is authenticated
    useEffect(() => {
        if (!user) {
            setError(true)  
        }

    }, [user])

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
            });   

            //! getInfo is undefined after updating the word
            console.log("getInfo: ", retrievedWord);
            return retrievedWord;
            
            

        } catch (error) {
            setError(true);
            console.error("Function getInfo: ", error);
        }

      }, [user]);


    // make sure to return the functions or states themselves
    return { user, getInfo, error}
}

// TODO: useContext. the functions will be used in multiple places
// Hook containing functions which write to the db
export function useSetVocab(user) {
    //TODO: create loading state
    const [error, setError] = useState();
    const [reload, setReload] = useState(false);

    // make sure user is authenticated
    useEffect(() => {
        if (!user) {
            setError(true)  
        }

    }, [user])

    // Edit existing vocab
    const editVocab = (listName, prevWord, newWord) => {
        // the paramater should have the prev and new versions

        const uid = user.uid;

        //? can i combine the 4 edit functions into one ?
        const editSource = async () => {
            const newSource = newWord.word;
            const oldSource = prevWord.word;

            // get the doc that contains the word
            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("word", "==", oldSource)
                );

                const nativeSnapshot = await getDocs(q);

                if (!nativeSnapshot.empty) { 
                    // get the doc(word) from the snapshpt
                    const firstDoc = nativeSnapshot.docs[0];
                    // get the id of the doc
                    const wordref = firstDoc.id; 
                
                    // Reference the doc
                    const docRef = doc(firestore, "Users", uid, listName, wordref);

                    try {
                        // update with user input
                        await updateDoc(docRef, {
                            word: newSource
                        });

                        console.log("successfully updated document");
                        setReload(true);
                    } catch (error) {
                        setError(true);
                        console.error("Function editSource: could not update source word", error)
                    }
                    
                } else {
                    throw new Error("Function editSource: No matching documents found");
                }
            } catch (error) {
                setError(true);
                console.error("Function editSource: could not get doc to edit source word", error);
            }
            

            

        }

        const editTrans = async () => {
            const newTrans = newWord.translation;
            const oldTrans = newWord.translation;

            // get the doc that contains the word
            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("word", "==", oldTrans)
                );

                const nativeSnapshot = await getDocs(q);

                if (!nativeSnapshot.empty) { 
                    // get the doc(word) from the snapshpt
                    const firstDoc = nativeSnapshot.docs[0];
                    // get the id of the doc
                    const wordref = firstDoc.id; 
                
                    // Reference the doc
                    const docRef = doc(firestore, "Users", uid, listName, wordref);

                    try {
                        // update translation with user input
                        await updateDoc(docRef, {
                            translation: newTrans
                        })
                    } catch (error) {
                        setError(true);
                        console.error("Function editSource: could not update translation", error)
                    }
                    
                } else {
                    throw new Error("Function editSource: No matching documents found");
                }
            } catch (error) {
                setError(true);
                console.error("Function editSource: could not get doc to edit translation", error);
            }
        }

        //TODO: complete
        const editDefinition = async () => {

        }
        //TODO: complete
        const editPOS = async () => {
            
        }

        //? will this work?
        // the idea is that the  user should be able to call either of these functions depending on the word they choose to edit
        return { editSource, editTrans }
    }

    return {editVocab, reload, error};
}