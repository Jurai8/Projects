import { firestore } from '../firebase';
import { setDoc, doc} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, updateProfile,} from "firebase/auth";
import { InputCheck } from './input';
/* TODO: 
create a learner class
    it it's methods will be the user related functions in MyEventHandlers.js
    what properties will it have (e.g uid, username)
*/

export class Learner {
    // TODO: create a contstructor
        // TODO: this.input = new Input();
    constructor() {
        this.input = new InputCheck()
    }

    // ! not needed ?
    getUsername() {
        return this.username;
    }

    // TODO: rework this if needed
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
                const passwordStrength = this.input.passwordStrength(password);
                if (!passwordStrength.isValid) {
                    alert(passwordStrength.errors);
                    throw new Error("could not create account due to invalid password");
                    
                }
                // check if user already exists
                const res = await this.checkUser(username, email)
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
    async LogIn(emailRef, passwordRef) {

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


    async checkUser(username, email) {
        try {
            const res = await fetch('/checkUser', {
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
}