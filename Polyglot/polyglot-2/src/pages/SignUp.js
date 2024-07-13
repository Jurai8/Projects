import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Register } from '../components/Modal';
import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';
// import sign in

import { firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore";


// chnage state from register to sign in if user clicks a button
// r

export default function SignUp () {
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    // collection name = user
    const ref = collection(firestore, "user");

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            emailRef.current &&
            usernameRef.current &&
            passwordRef.current &&
            // remove white spaces
            emailRef.current.value.trim() !== '' &&
            usernameRef.current.value.trim() !== '' &&
            passwordRef.current.value.trim() !== ''
          ) {
            const email = emailRef.current.value;
            const username = usernameRef.current.value;
            const password = passwordRef.current.value;

            // check if they already exisit in db
      
            try {
              await addDoc(ref, { email, username, password });
              console.log('Document successfully written!');
            } catch (error) {
              console.error('Error writing document: ', error);
            }
        } else {
            console.warn('credentials are undefined or null');
          }
    }

    return (
        <div>
            <CssBaseline />
            {/* conditional rendering for register and sign in */}
            <Register 
                handleSave={handleSave} emailRef={emailRef}
                usernameRef={usernameRef} passwordRef={passwordRef}
             /> 
        </div>
    )
}