import { useEffect, useState, useCallback } from "react"
import { firestore } from "../firebase";
import { 
    collection, doc, updateDoc, getDocs, query, where, deleteDoc, getDoc, addDoc,
    setDoc,
    getCountFromServer, 
} from "firebase/firestore"; 
import VocabLists from "../pages/VocabLists";


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
    
            if (!word.word || !word.translation) {
                setError(true);
                throw new Error("word.native or word.translation is undefined");
            }
    
            const q = query(
                collection(firestore, "Users", user.uid, listName),
                where("word", "==", word.word),
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

    const getVocab = useCallback(async (listName, field) => {

        // field = what the user wants, e.g. pos, definition etc
        const vocab = [];
        // get vocab from list

        console.log("test data: ListName - " + listName + "field: " + field);
        

        switch (field) {
            case "pos":
                // get every words translation and it's corresponding POS
                try {
                    const getVocabdocs = await getDocs(collection(firestore, "Users", user.uid, listName)); 
        
                    getVocabdocs.forEach((doc) => {
                        //append doc.data to array
                        vocab.push({
                            // main = what the user sees
                            main: doc.data().translation,
                            // value they're being tested
                            pos: doc.data().POS
                        });
                    });
        
                } catch (error) {
                    console.error("could not get POS for test", error);
                    throw new Error("could not get vocab for test");
                }
                break;

            case "translation":
                // get both the word and translation
                try {
                    const getVocabdocs = await getDocs(collection(firestore, "Users", user.uid, listName)); 
        
                    getVocabdocs.forEach((doc) => {
                        //append doc.data to array
                        vocab.push({
                            // main = what the user sees during the test
                            main: doc.data().word,
                            // value they're being tested (they're answer must match this)
                            translation: doc.data().translation
                        });
                    });
        
                } catch (error) {
                    throw new Error("could not get vocab for test", error);
                }
                break;

            case "definition":
                // get every words translation and it's corresponding def 
                try {
                    const getVocabdocs = await getDocs(collection(firestore, "Users", user.uid, listName)); 
        
                    getVocabdocs.forEach((doc) => {
                        //append doc.data to array
                        vocab.push({
                            // main = what the user sees during the test
                            main: doc.data().definition,
                            // value they're being tested (they're answer must match this)
                            translation: doc.data().translation
                        });
                    });
        
                } catch (error) {
                    throw new Error("could not get vocab for test", error);
                }
                break;

            // if the user doesn't request a specific field
            default:
                // get all data in vocab list
                try {
                    const getVocabdocs = await getDocs(collection(firestore, "Users", user.uid, listName)); 
        
                    getVocabdocs.forEach((doc) => {
                        //append doc.data to array
                        vocab.push(doc.data());
                    });
        
                } catch (error) {
                    throw new Error("could not get vocab for test", error);
                }

                break;
        }
        
        
        // how to return a randomized order of the array ?
        return vocab;
    }, [user])


    const getVocabLists = useCallback(async () => {

        const vocabLists = []

        try {
            // path to subcollection
            const querySnapshot = await getDocs(collection(
                firestore, "Users", user.uid, "All_Vocab_Lists"
            ));

            querySnapshot.forEach((doc) => {
                // add each vocablist into an array
                vocabLists.push({
                    listName: doc.id,
                    vocabCount: doc.data().Words
                });        
            });

            return vocabLists;
        } catch (error) {
            console.error("Could not get names of vocab lists", error);
        }
    }, [user])

    

    // make sure to return the functions or states themselves
    return {getVocab, getVocabLists, getInfo, error}
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



    const newCollection = async (collectionName, source, translation) => {
        try {
            await addWord(collectionName, source, translation);
            
            try {

                const userRef = doc(firestore, "Users", user.uid)
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    // increase the number of collections
                    const totalCollections = (userSnapshot.data().VocabLists ?? 0) + 1;
    
                    // update in db
                    try {
                        await updateDoc(userRef, {
                            VocabLists: totalCollections
                        });
                    } catch (error) {
                        console.error(error);
                    }
    
                    console.log("successfully updated total lists")
                }

            } catch (error) {
                console.error(error);
            }

            console.log("created collection");

        } catch (error) {
            console.error("could not create collection", error);
        }
    }

    const deletecollection = async (collectionName) => {

        const collectionPath = `Users/${user.uid}/${collectionName}`;

        // reference collection to get it's size
        const collectionRef = collection(firestore, "Users", user.uid, collectionName);

        const collSnapshot = await getCountFromServer(collectionRef);

        const response = await fetch('/deleteCollection', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            
            body: JSON.stringify({
                collectionPath: collectionPath,
                batchSize: collSnapshot.data().count,
            })
        });

        if (!response.ok) {
            console.error("Failed to delete collection");

        } else {

            // remove the collection record from "All_Vocab_Lists"
            const collRef = doc(firestore, "Users", user.uid, "All_Vocab_Lists", collectionName);

            const collSnapshot = await getDoc(collRef);

            // reference the user to decrease number of collections they own
            const userRef = doc(firestore, "Users", user.uid);

            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists() && collSnapshot.exists()) {

                // get the number of words in the collection
                const collWords = collSnapshot.data().Words;

                try {
                    await deleteDoc(collRef);

                    await updateDoc(userRef, {
                        VocabLists: userSnapshot.data().VocabLists - 1,
                        Total_Words: userSnapshot.data().Total_Words - collWords
                    });
                } catch (error) {
                    console.error(error);
                }
            } 

            console.log("Collection deleted successfully");
        }

    };


    const addWord = async(vocabList, word, translation) => {

        const listname = vocabList;

        const trans = translation;
        const source = word;

        if (typeof trans !== "string" || typeof source !== "string") {
            throw new Error("function addWord: Not a string");
        }

        // query for the words to see if they already exist
        const query1 = query(
            collection(firestore, "Users", user.uid, listname),
            where("word", "==", source)
        );

        const query2 = query(
            collection(firestore, "Users", user.uid, listname),
            where("translation", "==", trans)
        );

        
        try {
            // check if word/translation already exists in collection
            const nativeSnapshot = await getDocs(query1);
            const translationSnapshot = await getDocs(query2);
            
            // if the source word already exists
            if (!nativeSnapshot.empty) {
                alert("This word already exists within this collection");
                // throw an error
                throw new Error("This word already exists within this collection"); 
            }
            // if the translation already exists
            if (!translationSnapshot.empty) {
                alert("This translation already exists within this collection");
                // throw an error
                throw new Error("This translation already exists within this collection"); 
            }

            // if all goes well, add word / update vocab list
            const vocabListRef = collection(firestore, "Users", user.uid, listname)

            // this will update or even create a new list
            await addDoc(vocabListRef, {
                word: source,
                translation: trans,
                definition: "none",
                example: "none",
                POS: "none"
            })

            //!! at this point a new list will not have been added to all_vocabLists
            // path to listname within "All_Vocab_lists"
            const docRef = doc(firestore, "Users", user.uid, "All_Vocab_Lists", listname);
            // get the user doc to update total_words (for the account)
            
            const docSnap = await getDoc(docRef);

            const userDocRef = doc(firestore, "Users", user.uid);
            const userDocSnap = await getDoc(userDocRef);



            if (docSnap.exists() && userDocSnap.exists()) {
                

                const currTotalWords = Number(
                    userDocSnap.data().Total_Words ?? 0
                ) + 1

                const  currTotalCollWords = Number(
                    docSnap.data().Words ?? 0
                ) + 1
                

                try {
                    await updateDoc(docRef, {
                        Words: currTotalCollWords
                    });

                    await updateDoc(userDocRef, {
                        Total_Words: currTotalWords
                    });

                } catch (error) {
                    console.error(error);
                }
                
            } else {
                
                if (userDocSnap.exists()) {

                    const currTotalWords = Number(
                        userDocSnap.data().Total_Words ?? 0
                    ) + 1;

                    try {
                        await setDoc(docRef, {
                            Words: 1
                        });

                        await updateDoc(userDocRef, {
                            Total_Words: currTotalWords
                        });

                    } catch (error) {
                        console.error(error); 
                    }

                } else {
                    console.error("user does not exist");
                    return false
                }
                
            }
    

        } catch (error) {
            console.error("Could not add word", error);
            throw new Error("issue with user input");   
        }        
    }

    //? Can i combine these instead of repeating the code?
    // Edit existing vocab
    const editVocab = (listName, prevWord, newWord) => {
        // the paramater should have the prev and new versions
        

        const uid = user.uid;

        // used to find a word (document in the db) as their aren't and duplicates
        const oldTrans = prevWord.translation;
        const oldSource = prevWord.word

        //? can i combine the 4 edit functions into one ?
        const editSource = async () => {
            const newSource = newWord.word;
            
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

            // get the doc that contains the word
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

            // these are used to update the definition
            const newDef = newWord.definition;

            // get the doc that contains the word

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("word", "==", oldSource),
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
                        // update definition with user input
                        await updateDoc(docRef, {
                            definition: newDef
                        })
                    } catch (error) {
                        setError(true); //  not used right now
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

            // get the doc that contains the word

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("word", "==", oldSource),
                    where("translation", "==", oldTrans)
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

            // get the doc that contains the word

            try {
                const q = query(
                    collection(firestore, "Users", uid, listName),
                    where("word", "==", oldSource),
                    where("translation", "==", oldTrans)
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

        return { 
            editSource, editTrans, editDefinition, editPOS, editExample, 
        }
    }


    const deleteVocab = async(listName, wordPair) => {
        const uid = user.uid;
        
        const native = wordPair.word;
        const trans =  wordPair.translation;
        const vocabList = listName;

        console.log("native:", native)


        if (!trans || !native) {
            throw new Error("could not get words to delete");
        }

        //TODO: use FIRESTORE TRANSACTION, to make sure that if one call fails, the entire execution stops
        try {
            // * 1. Delete the word

            // query db to find doc that contains word AND translation
            const q = query(collection(firestore, "Users", uid, vocabList),
                where("word", "==", native), 
                where("translation", "==", trans)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0];
                // get the doc id
                const docId = docRef.id;
                
                // delete doc (the word)
                try {
                    await deleteDoc(doc(firestore, "Users", uid, vocabList, docId))
                } catch (error) {
                    throw new Error(error);
                }

                // * 2. update word count:

                // find the list within All_Vocab_Lists
                const documentRef = doc(firestore, "Users", uid, "All_Vocab_Lists", vocabList);
                
                const docSnap = await getDoc(documentRef);

                if (docSnap.exists()) {
                    // update "Words" field in ALL_Vocab_Lists (corresponding to vocab list)
                    
                    // treat it as a number if it isn't already
                    const currTotalWords = docSnap.data().Words ? Number(docSnap.data().Words) : 0;

                    console.log("total before:", currTotalWords)
                    // decrease total words
                    const newTotalWords = currTotalWords - 1;

                    console.log("total after:", newTotalWords)

                    // update in db
                    try {
                        await updateDoc(documentRef, {
                            Words: newTotalWords
                        })
                    } catch (error) {
                        throw new Error(error);
                    }

                    // * 3. update total words across entire profile

                    const userDocRef = doc(firestore, "Users", uid);

                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        // update "Words" field in ALL_Vocab_Lists (corresponding to vocab list)

                        // treat it as a number if it isn't already
                        const currTotalWords = userDocSnap.data().Total_Words ? Number(userDocSnap.data().Total_Words) : 0;
    
                        console.log("total before:", currTotalWords);

                        // decrease total words
                        const newTotalWords = currTotalWords - 1;
    
                        console.log("total after:", newTotalWords)
    
                        // update in db
                        try {
                            await updateDoc(userDocRef, {
                                Total_Words: newTotalWords
                            })
                        } catch (error) {
                            throw new Error(error);
                        }
                    }

                    alert("Successfully deleted word");

                } else {
                    console.error("Vocabulary list document does not exist");
                    throw new Error("Vocabulary list document does not exist");
                }

            } else {
                console.log('No documents found to delete');
            }
        } catch (error) {
            console.error("Error during word deletion and update:", error);
            alert("could not delete word");
        }
    }

    return {
        addWord, editVocab, deleteVocab, reload, error, newCollection,
        deletecollection
    };
}