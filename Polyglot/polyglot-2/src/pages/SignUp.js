import CssBaseline from '@mui/material/CssBaseline';
import { Register, LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';
import { getAuth, createUserWithEmailAndPassword, 
      signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { addDoc, doc, setDoc } from "firebase/firestore"; 
import { firestore } from '../firebase';




// chnage state from register to sign in if user clicks a button

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

  // store user in db
  async function storeUser(user) {
    const userDocRef = doc(firestore, 'Users', user.uid);
    const userData = {
      displayName: user.displayName,
    };

    try {
      await setDoc(userDocRef, userData);
      console.log('storeUser successful');
    } catch (error) {
      console.log('storeUser unsuccessful')
    }
    
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

      setSuccess(`Welcome ${user.email}`);
      setError(null)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      setSuccess(null);
    });
  }

  const handleSave = async (e) => {
      e.preventDefault();

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

            const user = auth.currentUser;
            storeUser(user);
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
              handleSave={handleSave} emailRef={emailRef}
              passwordRef={passwordRef} toggleSignIn={toggleSignIn}
              usernameRef={usernameRef}
            />
          }
  
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
  )
}