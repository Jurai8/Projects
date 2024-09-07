import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, getDoc, doc, updateDoc, query, where,
    deleteDoc
} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, updateProfile,} from "firebase/auth";

/* TODO: 
create a learner class
    it it's methods will be the user related functions in MyEventHandlers.js
    what properties will it have (e.g uid, username)
*/

export class Learner {

    #userid;
    constructor(userid, username, ) {
        this.#userid = userid;
        this.username = username;
    }

    getUsername() {
        return this.username;
    }


    // handle login

    // handle sign up

    // handle sign out

    // check password strength

    // check for existing user

}

export class Vocab {
    constructor(user) {
        // uid should be private?
        this.user = user;
        this.allVocabLists = [];
        // seperate variables or just on object?
        this.wordPair = {native: null , translation: null};
    }

    async CreateVocabList(name, word, translation) {
        // does it work i put this.uid?
        if (this.user) {
            const userId = this.user.uid;
            console.log(userId);
            // path to new vocab list
            const SpecificListRef = collection(firestore, "Users", userId, name);

            const pathToUserDoc = doc(firestore, "Users", userId);

            const docSnap = await getDoc(pathToUserDoc);
            // path to collection of vocab list names
            const AllVocabListNamesPath = doc(firestore, "Users", userId, "All_Vocab_Lists", name);

            try {
                // create new vocab list and add doc
                await addDoc(SpecificListRef, {
                    status: 'include', // "deleted" for delete
                    word: word, 
                    translation: translation
                }).catch((error) => {
                    console.error("unable to create new vocab list: ", error)
                    return;
                })

                // add new vocab list name to collection of vocab list names 
                await setDoc(AllVocabListNamesPath, {
                    ListName: name, // doc id = name, so this field probably doesn't need to be here
                    status: 'active'
                }).catch((error) => {
                    console.error("Unable to save list name to All_Vocab_Lists: ", error);
                    return; // Stop execution if setDoc fails
                });

                // update number of docs
                if (docSnap.exists()) {
                    // Retrieve the current number of vocab lists
                    let currentNumberOfVocabLists = docSnap.data().VocabLists || 0; // Default to 0 if undefined
                
                    // Increment the number of vocab lists
                    const numberOfVocabLists = currentNumberOfVocabLists + 1;
                
                    // Update the document with the new number of vocab lists
                    await updateDoc(pathToUserDoc, {
                        VocabLists: numberOfVocabLists,
                    }).catch((error) => {
                        console.error("unable to update number of vocablists: ", error)
                    });
                } else {
                    console.log("user doc does not exist");
                    return;
                }

                return `successfully created ${name} collection`;

            } catch (error) {
                console.error("could not create new list or save list name to collection of names: ", error)
            }

        } else {
            console.error("CreateVocabList: User not logged in")
        }
    }

    async getAllVocabLists() {
        const userId = this.user.uid;

        try {
            // path to subcollection
            const querySnapshot = await getDocs(collection(
                firestore, "Users", userId, "All_Vocab_Lists"
            ));

            querySnapshot.forEach((doc) => {
                // add each list name into an array
                this.allVocabLists.push(doc.id); 
            });

            return this.allVocabLists;
        } catch (error) {
            console.error("Could not get names of vocab lists", error);
        }
    }

    // updateVocab() in Heft.js
    // TODO: How to get the current list that the user is in?
    async addWord(vocabList, wordPair) {
        const userId = this.user.uid;
        const listname = vocabList;
        const newWord = wordPair;
        // check input 
        console.log(newWord);

        const error = this.checkInput(newWord);
        // it should return null, if not, end the program
        if (error.code != null) {
            alert(error.message);
            return false;
        }

        const query1 = query(
            collection(firestore, "Users", userId, listname),
            where("word", "==", newWord.native)
        );
        
        const query2 = query(
            collection(firestore, "Users", userId, listname),
            where("translation", "==", newWord.translation)
        );

        try {
            // check if word/translation already exists in collection
            const nativeSnapshot = await getDocs(query1);
            const translationSnapshot = await getDocs(query2);
    
            if (!nativeSnapshot.empty) {
                alert("This word already exists within this collection");
                throw new Error("This word already exists within this collection"); 
            }
    
            if (!translationSnapshot.empty) {
                alert("This translation already exists within this collection");
                throw new Error("This translation already exists within this collection"); 
            }
            // add word / update vocab list
            const vocabListRef = collection(firestore, "Users", userId, listname)
            
            await addDoc(vocabListRef, {
                status: "include",
                word: newWord.native,
                translation: newWord.translation
            }).catch((error) => {
                console.error('Error caught while adding document:', error);
                throw new Error("Error adding word to subcollection"); 
            });

            return true;
        } catch (error) {
            console.error("issue with user input", error);
            throw new Error("issue with user input");   
        }        
    }

    async editWord(collectionName, oldPair, newWord) {
        // check which property is null. the property with a value will be updated in db
        const uid = this.user.uid;
        // currently the user can only update one word at a time
        const newNative = newWord.native; 
        const oldNative = oldPair.native; 
        const newTrans =  newWord.translation;
        const oldTrans = oldPair.translation;
        const event = newWord.case; // different cases

        console.log(oldPair);

        // Maybe reconsider this !!!!!
        // either original or translation should have a valeu to find the doc
        if (!oldTrans || !oldNative) {
            throw new Error("Could not get original word pair");
        }

        // create an alert or something
        if (!event) {
            throw new Error('event is undefined');
        }


        switch (event) {
            // event 1 = update native
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
            // event 2 = update translation
            case 2:
                console.log("case 2...");
                console.log(newTrans);
                console.log("old:", oldTrans);
                console.log(collectionName)
                console.log(uid)
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
            // event 3 = update native and translation 
            case 3:
                if (newTrans != null || newNative != null) {
                    // check input
                    const q = query(
                        collection(firestore, "Users", uid, collectionName),
                        where("translation", "==", oldTrans),
                        where("word", "==", oldNative)
                    );
        
                    const wordPairSnapshot = await getDocs(q);
                    // get the id of the doc
                    const wordPairRef = wordPairSnapshot[0].docId;
                    // reference the doc
                    const docRef = doc(firestore, "User", uid, collectionName, wordPairRef);
        
                    // update with user input
                    await updateDoc(docRef, {
                        translation: newTrans,
                        word: newNative
                    }).catch((error) => {
                        alert("Could not update word set");
                        console.error(error);
                    })
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
    checkInput(word) {
        const native = word.native;
        const translation = word.translation;
        const alpha = /^[a-zA-Z]+$/;
        const error = {
            code: null,
            message: ""

        }

        // string should only contain alphabet
        // what about "-"?
        // I only want to make sure there aren't any numbers/special chars 
        if (!alpha.test(native) || !alpha.test(translation)) {
            error.code = 1;
            error.message = "Input should only contain alphabetical characters"
            return error;
        }

        // if input is empty
        if (native === '') {
            error.code = 2;
            error.message = "There is no word to be translated"
            return error;
        }

        if (translation === '') {
            error.code = 3;
            error.message = "There is no translation"
            return error;
        }

        return error;
    }

    async deleteCollection(listName) {
        const uid = this.user.uid;
        const vocabListRef = doc(firestore, "Users", uid, "All_Vocab_Lists", listName)
        const pathToUserDoc = doc(firestore, "Users", uid);
        const docSnap = await getDoc(pathToUserDoc);

        await updateDoc(vocabListRef, {
            status: "inactive"
        }).catch((error) => {
            alert(`Could not delete ${listName}`)
        })  

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

    // remove word
    async deleteWord(wordPair) {
        // query db to find doc that contains word AND translation
        const q = query(collection(firestore, "Users"),
         where("word", "==", wordPair.natve), 
         where("translation", "==", wordPair.translation)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            // get the doc id
            const docId = doc.id;
            // delete doc
            await deleteDoc(doc(firestore, "Users", docId)).catch((error) => {
                console.error("could not delete doc");
                alert("Could not delete word");
                throw new Error("could not delete doc"); 
            })
        } else {
            console.log('No documents found');
        }
    }

    // edit word


    // get allvocablists
        // if return null 
        // tell user to create a new list
}


export class Test {
    // constructor
    constructor(user) {
        this.user = user;
        // array of words to be tested on
        this.vocab = [];
        this.score = 0;
    }

    // fetchvocab()
    async getVocab() {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;
            // get vocab 
            try {
                const getVocabdocs = await getDocs(collection(firestore, "Users", userId, "Vocablist 1")); 

                getVocabdocs.forEach((doc) => {
                    this.vocab.push({
                        native: doc.data().word,
                        translation: doc.data().translation
                    });
                });
            } catch (error) {
                console.error("could not get vocab for test");
            }
            
            // how to return a randomized order of the array?
            return this.vocab;
        } else {
            console.error("User not logged in");
        }
    }

    checkAnswer(currentWord, currentAnswer) {
        if (currentWord === currentAnswer) {
            this.score++;
        } else {
            return false;
        }
    }

    verifyWordSet(vocabList, count) {
        if (vocabList.length > 0 && count < vocabList.length) {
            return true;
        }

        if (!vocabList === null) {
            return true;
        }

        return false;
    }

    // getscore
    getScore() {
        return this.score;
    }

    // set score?
}

// create class to check input?
// each method is a different case for checking the input
class Input {

    constructor(wordPair) {
        this.native = wordPair.native;
        this.trans = wordPair.translation;
    }

    addWord() {

    }

    // when changing a word in vocab list
    updateWord() {

    }

    // user create account
    checkPassowrd() {

    }
}