import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, getDoc, doc, updateDoc, query, where,
    deleteDoc, getCountFromServer
} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, updateProfile,} from "firebase/auth";

import { checkUser, CheckPasswordStrength } from './MyEventHandlers';
import VocabLists from '../pages/VocabLists';

/* TODO: 
create a learner class
    it it's methods will be the user related functions in MyEventHandlers.js
    what properties will it have (e.g uid, username)
*/

export class Learner {
    getUsername() {
        return this.username;
    }

    // ! redo this
    // handle sign up
    async SignUp(emailRef, passwordRef, usernameRef) {

        const email = emailRef;
        const password = passwordRef;
        const username = usernameRef;
    
        if (
            email &&
            password &&
            username &&
            // remove white spaces
            email.trim() !== '' &&
            username.trim() !== '' &&
            password.trim() !== ''
          ) {
    
            try {
                // Check password strength
                const passwordStrength = CheckPasswordStrength(password);
                if (!passwordStrength.isValid) {
                    alert(passwordStrength.errors);
                    throw new Error("could not create account due to invalid password");
                    
                }
                // check if user already exists
                const res = await checkUser(username, email)
                if (res.status === "error" ) {
                    alert(res.message);
                    throw new Error("res.message");
                } 
                
            } catch (error) {
                console.error(error, "Issue checking for identity");
                throw new Error("Failed to create account");
                
                /* return {
                    error: "Failed to create account",
                    success: null
                };; */ 

                // Handle the error appropriately, e.g., display a user-friendly message
            }
    
            const auth = getAuth();
            try {
              await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
                console.log(err)
              );
           
              await updateProfile(auth.currentUser, { displayName: username }).catch(
                (err) => console.log("unable to create username")
              )
    
              // get logged in user
              onAuthStateChanged(auth, async (user) => {
                if (user) {
                  const userId = user.uid;
                  const email = user.email;
                  const userData = {
                    Username: user.displayName,
                    Email: email,
                    VocabLists: 0
                  }
                  // docid = userid
                  const userDocRef = doc(firestore, 'Users', userId);
    
                  try {
                    await setDoc(userDocRef, userData);
                    console.log("user doc created");
                  } catch (error) {
                    console.error("could not create user doc")
                  }
                  
                } else {
                  console.error("No user is signed in.");
                }
              });
                
    
            } catch (error) {
                console.error("failed to create account")
            }
    
        } else {
            console.warn('credentials are undefined or null');
            alert("Fill in all the boxes");
          }
    }

    // handle login
    LogIn(emailRef, passwordRef) {

        const email = emailRef;
        const password = passwordRef;
    
        const auth = getAuth();
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                
                return {
                    success: `Welcome ${user.displayName || user.email}`,
                    error: null
                };
            }).catch((error) => {
                console.error(error);
                throw new Error("log in failed");
            });
    
    }
    // handle sign out
    SignOut() {
        const auth = getAuth();

        signOut(auth).then(() => {
            alert("Successfully signed out");
        }).catch((error) => {
            console.error(error);

            alert("Error while signing out");
        });
    }
}

export class Vocab {
    constructor(user) {
        // ! user should be private?
        this.user = user;
        this.allVocabLists = [];
        this.vocab = [];
        // seperate variables or just on object?
        this.wordPair = {native: null , translation: null};
    }

    wordClassifier(word) {
        const articles = ['der', 'die', 'das'];
        let newWord;

        function lowercaseFirstLetter(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        };

        function capitalizeFirstLetter(string) {
            // every noun would start at index 4
            return string.charAt(4).toUpperCase() + string.slice(1);
        };

        function addSpace(string) {
            const ogArticle = string.splice(0,3);
            const word = string.splice(4);

            const article = ogArticle + ' ';
            const newWord = article + word;

            return newWord;
        }

        // check if it's a noun
        articles.forEach(article => {
            if (word.includes(article)) {
                // change the article to lowercase
                newWord = lowercaseFirstLetter(word);

                // check for space between article and word 
                if(newWord[3] !== ' ') {
                    newWord = addSpace(newWord);
                } 

                // change the first letter of the noun to uppercase
                newWord = capitalizeFirstLetter(newWord);
            }

            // ! this only stops the loop not entire function
            return newWord;
        });
            
        // if it's any other word change the first letter to lowercase
        return newWord = lowercaseFirstLetter(word);
    }

    async CreateVocabList(listName, word, translation) {
        const userId = this.user.uid;
        
        // path to new vocab list
        const SpecificListRef = collection(firestore, "Users", userId, listName);

        const pathToUserDoc = doc(firestore, "Users", userId);

        // path to collection of vocab list names
        const AllVocabListNamesPath = doc(firestore, "Users", userId, "All_Vocab_Lists", listName);

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
        const newWord = wordPair;
        // check input 
        console.log(newWord);

        const error = this.checkInput(newWord);
        // it should return null, if not, end the program
        if (error.code !== 7) {
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
                word: newWord.native,
                translation: newWord.translation
            }).catch((error) => {
                console.error('Error caught while adding document:', error);
                throw new Error("Error adding word to subcollection"); 
            });

            // path to listname within "All_Vocab_lists"
            const docRef = doc(firestore, "Users", userId, "All_Vocab_Lists", listname);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data().Words || "0");

                // treat it as a number if it isn't already
                const currTotalWords = docSnap.data().Words ? Number(docSnap.data().Words) : 0;

                const newTotalWords = currTotalWords + 1;
                
                await updateDoc(docRef, {
                    Words: newTotalWords
                }).catch((error) => {
                    console.error(error);
                });
            } else {
            // docSnap.data() will be undefined in this case
            console.error("couldn't find collection");
            alert("couldn't find collection");
            }

            

            // TODO: go to all vocablists add a field under each doc(vocab list) for how many words the list has

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
        const newTrans =  newWord.translation;
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
    checkInput(word) {
        const native = word.native;
        const translation = word.translation;
        const alpha = /^[a-zA-Z]+$/;
        const error = {
            code: 7,
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
            
            // delete doc
            await deleteDoc(doc(firestore, "Users", uid, collectionName, docId)).catch((error) => {
                alert("Could not delete word");
                throw new Error("could not delete doc"); 
            });
        } else {
            console.log('No documents found');
        }
    }
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
    // TODO: add variables for collection name
    async getVocab() {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;
            // get vocab 
            try {
                const getVocabdocs = await getDocs(collection(firestore, "Users", userId, "Family")); 

                getVocabdocs.forEach((doc) => {
                    this.vocab.push({
                        native: doc.data().word,
                        translation: doc.data().translation
                    });
                });
            } catch (error) {
                console.error("could not get vocab for test");
            }
            
            // how to return a randomized order of the array ?
            return this.vocab;
        } else {
            console.error("User not logged in");
        }
    }

    checkAnswer(currentWord, currentAnswer) {

        console.log(currentWord,currentAnswer, currentWord === currentAnswer)
        if (currentWord === currentAnswer) {
            this.score = this.score + 1;
            console.log(this.score)
            return true;
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

    // allow user to select a date
    // we remind them on the date - the time to do the test is up to them
    scheduleTest(date, time) {
       

    }

    // getscore
    getScore() {
        return this.score;
    }

    // set score?
}

// create class to check input?