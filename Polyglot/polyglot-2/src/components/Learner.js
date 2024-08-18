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

        const error = this.checkInput(newWord,listname);
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

    // remove collection
        // find collection
        // change status to "inactive"

    // remove word
        // find the word
        // change status to "exclude"

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