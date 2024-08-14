import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, getDoc, doc, updateDoc, query, where
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
        if (this.user) {
            const userId = this.user.uid;
            // path to subcollection
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
        
        } else {
            console.log("user not logged in");
        }
        
    }

    // updateVocab() in Heft.js
    // TODO: How to get the current list that the user is in?
    async addWord(vocabList, wordPair) {
        if (this.user) {
            const userId = this.user.uid;
                try {
                    const vocabListRef = collection(firestore, "Users", userId, vocabList)
                    
                    // update vocablist
                    try {
                        // check if input is valid
                        // validateWordPair(wordPair.native, wordPair.translation) - class that checks input?
                        try {
                            await addDoc(vocabListRef, {
                                word: wordPair.word,
                                translation: wordPair.translation
                            });
                
                            console.log("Vocab list has been updated");
                        } catch (error) {
                            console.error('Error caught while adding document:', error);
                            alert("Error adding word to subcollection");
                        }
                    } catch (error) {
                        console.error('Error caught while updating rows:', error);
                        alert("Error updating rows");
                    }

                } catch (error) {
                    console.error('Error referencing subcollection:', error.message);
                    alert("Error referencing subcollection");
                }
        } else {
            console.log("user not signed in")
        }
    }

    // remove collection

    // remove word

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