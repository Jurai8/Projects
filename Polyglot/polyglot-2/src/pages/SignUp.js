import CssBaseline from '@mui/material/CssBaseline';
import { Register, LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';
import { getAuth, createUserWithEmailAndPassword, 
      signInWithEmailAndPassword, updateProfile,
    onAuthStateChanged} from "firebase/auth";
import { addDoc, doc, setDoc, collection } from "firebase/firestore"; 
import { firestore } from '../firebase';


/* if logged in user doesn't have a library ask them 
    to create their first library
*/

export default function SignUp () {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [signIn, setSignIn] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null)

  const toggleSignIn = () => {
    setSignIn(!signIn);
  }


  const handleLogin = async (e) => {
      e.preventDefault();

      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;

      setSuccess(`Welcome ${user.displayName}`);
      setError(null)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      setSuccess(null);
    });
  }

  const handleSignIn = async (e) => {
      e.preventDefault();

      // create a function to check input
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const username = usernameRef.current.value;

      if (
          email &&
          password &&
          username &&
          // remove white spaces
          email.trim() !== '' &&
          username.trim() !== '' &&
          password.trim() !== ''
        ) {
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
                const userData = {
                  Username: user.displayName
                }
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

            setSuccess(`Congratulations ${auth.currentUser.displayName} !`);
            setError(null);
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
            setSuccess(null);
          }

      } else {
          console.warn('credentials are undefined or null');
        }
  }

  return (
      <div>
          <CssBaseline />
          {/* conditional rendering for register and sign in */}
          {signIn ? 
            <LogIn toggleSignIn={toggleSignIn} handleLogin={handleLogin}
            emailRef={emailRef} passwordRef={passwordRef}
            /> :
            <Register 
              handleSignIn={handleSignIn} emailRef={emailRef}
              passwordRef={passwordRef} toggleSignIn={toggleSignIn}
              usernameRef={usernameRef}
            />
          }
  
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
  )
}