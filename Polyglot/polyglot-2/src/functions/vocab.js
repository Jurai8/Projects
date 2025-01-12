import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, getDoc, doc, updateDoc, query, where,
    deleteDoc,
} from "firebase/firestore"; 
import { InputCheck } from './input';

export class Vocab {
    constructor(user) {
        // ! user should be private?
        this.user = user;
        this.allVocabLists = [];
        this.vocab = [];
        // seperate variables or just on object?
        this.wordPair = {native: null , translation: null};
        this.input = new InputCheck();
    }

    async CreateVocabList(listName, word, translation) {
        const userId = this.user.uid;
        
        // path to new vocab list
        const SpecificListRef = collection(firestore, "Users", userId, listName);

        const pathToUserDoc = doc(firestore, "Users", userId);

        // path to collection of vocab list names
        const AllVocabListNamesPath = doc(firestore, "Users", userId, "All_Vocab_Lists", listName);

        // check if the word is a noun or not
        translation = this.input.classifyWord(translation);

        try {
            // create new vocab list and add doc
            await addDoc(SpecificListRef, {
                // TODO: Add POS field
                //* e.g POS: noun
                word: word, 
                translation: translation
            }).catch((error) => {
                console.error("unable to create new vocab list: ", error)
                return;
            })

            // add new vocab list name to collection of vocab list names 
            await setDoc(AllVocabListNamesPath, {
                ListName: listName, // doc id = name, so this field probably doesn't need to be here
                Words: 1,
            }).catch((error) => {
                console.error("Unable to save list name to All_Vocab_Lists: ", error);
                return; // Stop execution if setDoc fails
            });

            const docSnap = await getDoc(pathToUserDoc);

            // update number of docs
            if (docSnap.exists()) {
                // Retrieve the current number of vocab lists
                const currTotalVocabLists = docSnap.data().VocabLists || 0; // Default to 0 if undefined
            
                // Increment the number of vocab lists
                const newTotalLists = currTotalVocabLists + 1;
            
                // Update the document with the new number of vocab lists
                await updateDoc(pathToUserDoc, {
                    VocabLists: newTotalLists,
                }).catch((error) => {
                    console.error("unable to update number of vocablists: ", error)
                });
            } else {
                console.error("user doc does not exist");
                return;
            }

            return `successfully created ${listName} collection`;

        } catch (error) {
            console.error("could not create new list or save list name to collection of names: ", error)
        }
    }

    async getAllVocabLists() {
        const uid = this.user.uid;

        try {
            // path to subcollection
            const querySnapshot = await getDocs(collection(
                firestore, "Users", uid, "All_Vocab_Lists"
            ));

            querySnapshot.forEach((doc) => {
                // add each vocablist into an array
                this.allVocabLists.push({
                    listName: doc.id,
                    vocabCount: doc.data().Words
                });        
            });

            return this.allVocabLists;
        } catch (error) {
            console.error("Could not get names of vocab lists", error);
        }
    }

    async getVocabulary(collectionName) {
        const uid = this.user.uid;

        try {
            const querySnapshot = await getDocs(collection(
                firestore, "Users", uid, collectionName
            ));
    
            querySnapshot.forEach((doc) => {
                // add each wordpair into the array
                
                this.vocab.push({
                    word: doc.data().word,
                    translation: doc.data().translation
                });
            })
        } catch (error) {
            console.error(error);
            return null;
        }

        return this.vocab;
    }

    async addWord(vocabList, wordPair) {
        const userId = this.user.uid;
        const listname = vocabList;

        // check if it's a noun. regardless, return the word
        const trans = this.input.classifyWord(wordPair.translation);
        const native = wordPair.native

        if (typeof trans !== "string" || typeof native !== "string") {
            throw new Error("function addWord: Not a string");
        }

        const query1 = query(
            collection(firestore, "Users", userId, listname),
            where("word", "==", native)
        );


        const query2 = query(
            collection(firestore, "Users", userId, listname),
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

            // add word / update vocab list
            const vocabListRef = collection(firestore, "Users", userId, listname)
            
            await addDoc(vocabListRef, {
                word: native,
                translation: trans,
                definition: "none",
                POS: "none"
            }).catch((error) => {
                console.error('Error caught while adding document:', error);
                throw new Error("Error adding word to subcollection"); 
            });

            // path to listname within "All_Vocab_lists"
            const docRef = doc(firestore, "Users", userId, "All_Vocab_Lists", listname);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data().Words || "0");

                // update "Words" field in ALL_Vocab_Lists (corresponding to vocab list)
                // treat it as a number if it isn't already
                const currTotalWords = docSnap.data().Words ? Number(docSnap.data().Words) : 0;

                const newTotalWords = currTotalWords + 1;
                
                await updateDoc(docRef, {
                    Words: newTotalWords
                }).catch((error) => {
                    throw new Error(error); 
                });
            } else {
            // docSnap.data() will be undefined in this case
            console.error("couldn't find collection");
            alert("couldn't find collection");
            }

            return true;
        } catch (error) {
            console.error("issue with user input", error);
            throw new Error("issue with user input");   
        }        
    }

    async editWord(collectionName, oldPair, newWord) {
        const uid = this.user.uid;
    
        const newNative = newWord.native; 
        const oldNative = oldPair.native; 

        // check if it's a noun and make sure it's written correctly
        const newTrans =  this.input.classifyWord(newWord.translation);

        const oldTrans = oldPair.translation;
        const event = newWord.case; // different cases

    

        // Maybe reconsider this !!!!!
        // either original or translation should have a value to find the doc
        if (!oldTrans || !oldNative) {
            throw new Error("Could not get original word pair");
        }

        // create an alert or something
        if (!event) {
            throw new Error('event is undefined');
        }


        switch (event) {
            // event = 1 = update native
            case 1:
                if (newNative) {
                    // check input this.checkInput

                    const q = query(
                        collection(firestore, "Users", uid, collectionName),
                        where("word", "==", oldNative)
                    );

                    // get the doc that contains the word
                    const nativeSnapshot = await getDocs(q).catch((err)=> {
                        console.error(err);
                        throw new Error(err);
                    });

                    // when successful the page should refresh?

                    if (!nativeSnapshot.empty) { 
                        
                        const firstDoc = nativeSnapshot.docs[0];
                        const wordref = firstDoc.id; 
                    
                        // Reference the doc
                        const docRef = doc(firestore, "Users", uid, collectionName, wordref);
                    
                        // update with user input
                        await updateDoc(docRef, {
                            word: newNative
                        }).catch((error) => {
                            alert("Could not update word");
                            console.error(error);
                        })
                    } else {
                        throw new Error("Case 1: No matching documents found");
                    }

                } else {
                    throw new Error("case 1: Invalid input");
                }
                break;
            // event = 2 = update translation
            case 2:
                if (newTrans) {
                    // check input
                    const q = query(
                        collection(firestore, "Users", uid, collectionName),
                        where("translation", "==", oldTrans)
                    );
        
                    const transSnapshot = await getDocs(q).catch((err)=> {
                        console.error(err);
                        throw new Error(err);
                    });
                    
                    if (!transSnapshot.empty) {
                        const ogDoc = transSnapshot.docs[0]

                        // get the id of the doc
                        const wordRef = ogDoc.id;

                         // reference the doc
                        const docRef = doc(firestore, "Users", uid,collectionName, wordRef);

                        // TODO: call input obj and check newTrans - is it a noun?
                        
                        // update with user input
                        await updateDoc(docRef, {
                            translation: newTrans
                        }).catch((error) => {
                            alert("Could not update translation");
                            console.error(error);
                        })
                    } else {
                        throw new Error("Case 2: No matching documents found");
                    }
                   
                } else {
                    throw new Error("Invalid input");
                }
                break;
            // event = 3 = update native and translation 
            case 3:
                if (newTrans && newNative) {
                    // check input
                    const q = query(
                        collection(firestore, "Users", uid, collectionName),
                        where("translation", "==", oldTrans),
                        where("word", "==", oldNative)
                    );

                    const wordPairSnapshot = await getDocs(q).catch((err)=> {
                        throw new Error(err);
                    });

                    if (!wordPairSnapshot.empty) {
                        
                        const wordPairRef = wordPairSnapshot.docs[0];

                        // get the id of the doc
                        const docid = wordPairRef.id;

                        // reference the doc
                        const docRef = doc(firestore, "Users", uid, collectionName, docid);

                        // update with user input
                        await updateDoc(docRef, {
                            translation: newTrans,
                            word: newNative
                        }).catch((error) => {
                            alert("Could not update word set");
                            console.error(error);
                        })
                    } else {
                        throw new Error("Case 3: No matching documents found");
                    }
                    
                } else {
                    throw new Error("Invalid input");
                }
                break;
            // if there is no match
            default:
                break;
        }
        
    }

   // check if the input is valid (no extra spaces, special chars etc)
        // check if the word already exists in the db   

    async deleteCollection(listName) {

        //! how it should work:
            // ! collections can't be deleted
            // ! go to "All_Vocab_Lists" and delete the collection name (saved as a doc)
            // the collection won't actually be deleted but the user won't be able to access it
            // TODO: can i write code to delete it as an admin? similar to checkUser(); 

        const uid = this.user.uid;
        const vocabListRef = doc(firestore, "Users", uid, "All_Vocab_Lists", listName)
        const pathToUserDoc = doc(firestore, "Users", uid);
        const docSnap = await getDoc(pathToUserDoc);

        await deleteDoc(vocabListRef).catch((error) => {
            alert("Could not delete list");
            throw new Error("could not delete Vocab list doc"); 
        });

        // update number of docs
        if (docSnap.exists()) {
            // Retrieve the current number of vocab lists
            const currentNumberOfVocabLists = docSnap.data().VocabLists;
        
            // Decrement the number of vocab lists
            const numberOfVocabLists = currentNumberOfVocabLists - 1;
        
            // Update the document with the new number of vocab lists
            await updateDoc(pathToUserDoc, {
                VocabLists: numberOfVocabLists,
            }).catch((error) => {
                console.error("unable to decrease number of vocablists: ", error)
            });
        }
    }

    //* remove word
    async deleteWord(currCollection, wordPair) {
        const uid = this.user.uid;

        const native = wordPair.native;
        const trans =  wordPair.translation;
        const collectionName =  currCollection;


        if (!trans || !native) {
            throw new Error("could not get words to delete");
        }

        //! refactor using firestore transaction, to make sure that if one call fails, the entire execution stops
        try {
            // * 1. Delete the word

            // query db to find doc that contains word AND translation
            const q = query(collection(firestore, "Users", uid, collectionName),
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
                    await deleteDoc(doc(firestore, "Users", uid, collectionName, docId))
                } catch (error) {
                    throw new Error(error);
                }

                // update word count

                // find the list within All_Vocab_Lists
                const documentRef = doc(firestore, "Users", uid, "All_Vocab_Lists", collectionName);
                
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
}
