import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, doc, updateDoc, query, where
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
            // path to collection of vocab list names
            const AllVocabListNamesPath = doc(firestore, "Users", userId, "All_Vocab_Lists", name);

            try {
                // create new vocab list and add doc
                await addDoc(SpecificListRef, {
                    status: 'active',
                    word: word, 
                    translation: translation
                }).catch(
                    (error) => console.error("unable to create new vocab list: ", error)
                )

                // add new vocab list name to collection of vocab list names 
                await setDoc(AllVocabListNamesPath, {
                    ListName: name, // doc id = name, so this field probably doesn't need to be here
                    status: 'active'
                }).catch(
                    (error) => console.error("unable to save list name to collection of names: ", error)
                )

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
    // get allvocablists
        // if return null 
        // tell user to create a new list
}