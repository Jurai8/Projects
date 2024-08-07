

import { useState } from 'react';
import { firestore } from '../firebase';
import { 
    setDoc, addDoc, collection, getDocs, doc, updateDoc, query, where
} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, updateProfile,} from "firebase/auth";
// Signup.js looks terrible because of all the functions
// this will be a mini library
// export all functions that should be added here
// import in files
    //e.g import {handleLogin, handleSave} from 'MyEventHandlers'

async function checkUser(username, email) {
    try {
        const res = await fetch('/api/check-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email }),
          });
          const data = await res.json();
          
          console.log("Request sent successfully")
          return data;
    } catch (error) {
        console.log("Error sending request")
    }
}

export function CheckPasswordStrength(password) {
    function hasNumber(userString) {
        return /\d/.test(userString);
      }

    function hasUppercase(userString) {
        return /[A-Z]/.test(userString);
      }

    function hasSpecialChars(userString) {
        return /[!@#$()]/.test(userString);
      }

    function checkForChars(userString) {
        return /[a-z]/i.test(userString)
    }

    function checkForUnmentionedChars(userString) {
        for (let i = 0; i < userString.length; i++) {
            if (!hasNumber(userString[i]) && !hasSpecialChars(userString[i]) && !checkForChars(userString[i])) {
                return false;
            }
        }

        return true;
    }

    let errorMessage = {
        isValid: true,
        errors: []
    };

    // must contain:
    // 7 chars minimun
    if (password.length < 7) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password cannot be shorter than seven character");
    }
    // at least one number
    if (!hasNumber(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password must contain at least one number");
    }
    // upper case letter
    if (!hasUppercase(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password must contain an uppercase letter")
    } 

    // special char: !, @, #, $, ()
    if (!hasSpecialChars(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password must contain at least one special character")
    }

    // if contains anything besides theses warn user
    if (!checkForUnmentionedChars(password)) {
        errorMessage.isValid = false;
        errorMessage.errors.push("Password should not contain any spaces. It should only contain what was specified before");
    }

    return errorMessage;
}

export function SignOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
}


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
                    status: 'active',
                    word: word, 
                    translation: translation
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
        
        // how to return a randomized order of the array?
        return vocabList;
    } else {
        console.error("User not logged in");
    }
}
// TODO: delete for now = move to bin
    // should each doc have a doc id = the native word?
// if they hover or click on the row, show these 2 options
    // edit word in vocab collection

// "delete" word from collection
export async function RemoveWord(collection, word, translation) {
    // TODO: 
        // edit this function if i decide to change docid = native word
    const auth = getAuth();
    const user = auth.currentUser;
    // query in collection for docs that have the properties 
        // word: word passed in arg
        // translation: word passed in arg

        const findDoc= query(collection(firestore, "Users", user.uid, collection), where("word", "==", word), 
        where("translation", "==", translation));

        try {
            // Execute the query to get documents
            const querySnapshot = await getDocs(findDoc);
        
            // Check if any documents were found
            if (!querySnapshot.empty) {
              // Get the first document in the query snapshot
              const document = querySnapshot.docs[0];
              const docRef = doc(firestore, "Users", user.uid, collection, document.id);
        
              // remove word by updating the status of the document
              await updateDoc(docRef, {
                status: "inactive"
              });
              console.log(`Document ${document.id} status updated successfully!`);
            } else {
              console.log("No documents found matching the criteria.");
            }
          } catch (error) {
            console.error("Error setting status to inactive: ", error);
          }
}


// "delete" collection
// show option to delete with right click, on collection button within    collection drawer/ sidebar
export async function RemoveCollection(collectionName, status) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        // reference doc within All_Vocab_Lists,
        const docRef =  doc("Users", user.uid, "All_Vocab_Lists", collectionName) // collectionName as doc

        try {
            // "delete" doc by changing status to inactive
            await updateDoc(docRef, {
              status: status
            });
            console.log("Document status updated successfully!");
          } catch (error) {
            console.error("Error setting status to inactive: ", error);
          }
    } else {
        console.log("user not signed in")
    }
}


// export to heft
// heft will take in the variables
export async function EditWord(vocabList, vocabDoc, newWord, newTranslation) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        // reference doc with vocab
        const docRef =  doc("Users", user.uid, vocabList, vocabDoc) 

        try {
            // update doc with user input
            await updateDoc(docRef, {
              word: newWord,
              translation: newTranslation
            });
            console.log("vocab successfully updated");
          } catch (error) {
            console.error("error updating vocab", error);
          }
    } else {
        console.log("user not signed in")
    }

} 


export function HandleLogin(emailRef, passwordRef) {

    const email = emailRef;
    const password = passwordRef;

    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            
            return {
                success: `Welcome ${user.displayName}`,
                error: null
            };
        })
        .catch((error) => {
            return {
                error: "Failed to login",
                success: null
            };
        });

}

export async function HandleSignUp(emailRef, passwordRef, usernameRef) {

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
                return false;
            }

            const res = await checkUser(username, email);
            if (res.status === "error" ) {
                alert(res.message);
                return false;
            } 
            // Proceed with the rest of the logic if no errors
        } catch (error) {
            console.error("Issue checking for identity (async function)");
            return {
                error: "Failed to create account",
                success: null
            };;
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
                Email: email
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
              console.log("No user is signed in.");
            }
          });

          return {
            success:`Hello ${username}`,
            error: null
          }
            

        } catch (error) {
            return {
                error: "Failed to create account",
                success: null
            };
        }

    } else {
        console.warn('credentials are undefined or null');
      }
}
// TODO:
    // hide words
        // button = hide
            // dropdown = native/ translation
            // if translation hide translation column
            // if native hide native column

    // Logout user