import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, doc
} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged,} from "firebase/auth";
// Signup.js looks terrible because of all the functions
// this will be a mini library
// export all functions that should be added here
// import in files
    //e.g import {handleLogin, handleSave} from 'MyEventHandlers'

export function UserVocabLists() {
    // get the currently signed in user
    const auth = getAuth();

    return new Promise ((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;
                const vocabListNames = [];

                // path to subcollection
                const querySnapshot = await getDocs(collection(
                    firestore, "Users", userId, "All_Vocab_Lists"
                ));

                querySnapshot.forEach((doc) => {
                    // add each list name into an array
                    vocabListNames.push(doc.id); 
                });

                resolve(vocabListNames);
            } else {
                reject("UserVocabList: User not logged in");
            }
        });
    })
}

/* say the user wants to view a specific vocab list
   onclick event, take the string of the button they clicked on
   copy that string onto the user path
    then display the vocab list
*/

// in the future: set a limit to the number of lists per user
export function CreateVocabList(name, word, translation) {

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            // path to new vocab list
            const SpecificListRef = doc(firestore, "User", userId, name);
            // path to collection of vocal list names
            const AllVocabListNamesPath = doc(firestore, "User", userId, "All_Vocab_Lists");

            try {
                // create new vocab list and add doc
                await addDoc(SpecificListRef, {
                    word: word, translation: translation
                }).catch(
                    (error) => console.error("unable to create new vocab list")
                )

                /* add new vocab list name to collection of vocab list names */
                await setDoc(AllVocabListNamesPath, name, {
                    ListName: name
                }).catch(
                    (error) => console.error("unable to save list name to collection of names")
                )
            } catch (error) {
                console.error("could not create new list or save list name to collection of names")
            }

        } else {
            console.error("CreateVocabList: User not logged in")
        }
    });
}

// string = vocablist name will be passed to this func, onclick event
// use this function when asking user which list they want to view
// then pass rows to Table.js
export async function DisplayVocabList(collectionName) {
    const auth = getAuth();
    const user = auth.currentUser; 

    console.log(`Collection name: ${collectionName}`)
    // pass an object (word and translation in one obj) into the array?
    if (user) {
        const userId = user.uid;
        const vocabulary = [];
        // path to subcollection
        const querySnapshot = await getDocs(collection(
            firestore, "Users", userId, collectionName
        ));

        querySnapshot.forEach((doc) => {
            // add each wordpair into the array
            console.log(`data: ${doc.data().word}`);

            vocabulary.push({
                word: doc.data().word,
                translation: doc.data().translation
            });
        });

        console.log(vocabulary)
       return vocabulary;
    } else {
        console.error("user not signed in");
    }
}

export async function FetchVocab () {
    const vocabList = [];

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        // get vocab 
        try {
            const getVocabdocs = await getDocs(collection(firestore, "Users", userId, "Vocablist 1"));   

            getVocabdocs.forEach((doc) => {
                vocabList.push({
                    native: doc.data().word,
                    translation: doc.data().translation
                });
            });
        } catch (error) {
            console.error("could not get vocab for test");
        }

        return vocabList;
    } else {
        console.error("User not logged in");
    }
}

// edit word in vocab collection
// delete word from collection
// delete collection

// hide words
    // button = hide
        // dropdown = native/ translation
        // if translation hide translation column
        // if native hide native column
// check password strenght + credentials for register