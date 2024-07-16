import CssBaseline from '@mui/material/CssBaseline';
import { Register, LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';
import { getAuth, createUserWithEmailAndPassword, 
      signInWithEmailAndPassword} from "firebase/auth";



// chnage state from register to sign in if user clicks a button

export default function SignUp () {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [signIn, setSignIn] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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

      if (
          emailRef.current &&
          passwordRef.current &&
          // remove white spaces
          emailRef.current.value.trim() !== '' &&
          passwordRef.current.value.trim() !== ''
        ) {
          
          const email = emailRef.current.value;
          const password = passwordRef.current.value;

          const auth = getAuth();
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            setSuccess('User signed up successfully!');
            setError(null);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
            setSuccess(null);
            // ..
          });
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
            />
          }
  
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
  )
}