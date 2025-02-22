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

    const getVocab = async (listName) => {

        const vocab = [];
        // get vocab from list
        try {
            const getVocabdocs = await getDocs(collection(firestore, "Users", user.uid, listName)); 

            getVocabdocs.forEach((doc) => {
                //append doc.data to array
                vocab.push(doc.data());
            });

        } catch (error) {
            console.error("could not get vocab for test", error);
        }
        
        // how to return a randomized order of the array ?
        return vocab;
    }




    // make sure to return the functions or states themselves
    return {getVocab, getInfo, error}
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

    //? Can i combine these instead of repeating the code?
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
            const oldTrans = prevWord.translation;

            // get the doc that contains the word

            console.log(listName, oldTrans);

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("translation", "==", oldTrans)
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

        const editDefinition = async () => {
            const newDef = newWord.definition;
            const oldDef = prevWord.definition;

            // get the doc that contains the word

            console.log(listName, "old:", oldDef, "new:", newDef);

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("definition", "==", oldDef)
                );

                const nativeSnapshot = await getDocs(q);

                if (!nativeSnapshot.empty) { 
                    // get the doc(word) from the snapshpt
                    const firstDoc = nativeSnapshot.docs[0];
                    // get the id of the doc (the word)
                    const wordref = firstDoc.id; 
                
                    // Reference the doc
                    const docRef = doc(firestore, "Users", uid, listName, wordref);

                    try {
                        // update definition with user input
                        await updateDoc(docRef, {
                            definition: newDef
                        })
                    } catch (error) {
                        setError(true);
                        console.error("Function editDefinition: could not update definition", error)
                    }
                    
                } else {
                    throw new Error("Function editDefinition: No matching documents found");
                }
            } catch (error) {
                setError(true);
                console.error("Function editDefinition: could not get doc to edit definition", error);
            }
        }

        const editPOS = async () => {
            const newPOS = newWord.POS;
            const oldPOS = prevWord.POS;

            // get the doc that contains the word

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("POS", "==", oldPOS)
                );

                const nativeSnapshot = await getDocs(q);

                if (!nativeSnapshot.empty) { 
                    // get the doc(word) from the snapshpt
                    const firstDoc = nativeSnapshot.docs[0];
                    // get the id of the doc (the word)
                    const wordref = firstDoc.id; 
                
                    // Reference the doc
                    const docRef = doc(firestore, "Users", uid, listName, wordref);

                    try {
                        // update definition with user input
                        await updateDoc(docRef, {
                            POS: newPOS
                        })

                        console.log("Update POS: Success");
                    } catch (error) {
                        setError(true);
                        console.error("Function editPOS: could not update POS", error)
                    }
                    
                } else {
                    throw new Error("Function editPOS: No matching documents found");
                }
            } catch (error) {
                setError(true);
                console.error("Function editPOS: could not get doc to edit POS", error);
            }
        }

        const editExample = async () => {
            const newEx = newWord.example;
            const oldEx = prevWord.example;

            // get the doc that contains the word

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("example", "==", oldEx)
                );

                const nativeSnapshot = await getDocs(q);

                if (!nativeSnapshot.empty) { 
                    // get the doc(word) from the snapshpt
                    const firstDoc = nativeSnapshot.docs[0];
                    // get the id of the doc (the word)
                    const wordref = firstDoc.id; 
                
                    // Reference the doc
                    const docRef = doc(firestore, "Users", uid, listName, wordref);

                    try {
                        // update definition with user input
                        await updateDoc(docRef, {
                            example: newEx
                        })

                        console.log("Update Example: Success");
                    } catch (error) {
                        setError(true);
                        console.error("Function editExample: could not update Example", error)
                    }
                    
                } else {
                    throw new Error("Function editExample: No matching documents found");
                }
            } catch (error) {
                setError(true);
                console.error("Function editExample: could not get doc to edit Example", error);
            }
        }

        return { editSource, editTrans, editDefinition, editPOS, editExample }
    }

    return {editVocab, reload, error};
}