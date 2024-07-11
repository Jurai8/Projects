import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Register } from '../components/Modal';
import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';

import { firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore";

// !!! move all necessary stuf back to the register component

export default function SignUp () {
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    // collection name = user
    const ref = collection(firestore, "user")

    const handleSave = async (e) => {
        e.preventDefault();

        if (emailRef.current && usernameRef && passwordRef ) {
            const email = emailRef.current.value;
            const username = usernameRef.current.value;
            const password = passwordRef.current.value;
      
            try {
              await addDoc(ref, { email, username, password });
              console.log('Document successfully written!');
            } catch (error) {
              console.error('Error writing document: ', error);
            }
        } else {
            console.warn('messageRef.current is undefined or null');
          }
    }

    return (
        <div>
            <CssBaseline />
            {/* <Register handleSave={handleSave} messageRef={messageRef} /> */}
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSave}
                >
                <div >
                    <TextField
                    id='outlined-basic-email'
                    placeholder="carlos@gmail.com"
                    label="Email"
                    variant="outlined"
                    inputRef={emailRef}
                    />
                </div>
                <div >
                    <TextField
                    id='outlined-basic-username'
                    label="Username"
                    variant="outlined"
                    typeof='text'
                    inputRef={usernameRef}
                    />
                </div>
                <div>
                    <TextField
                    id='outlined-basic-password'
                    label="Password"
                    variant="outlined"
                    inputRef={passwordRef}
                    />
                </div>
                <Button id="Confirm-word" variant="contained" type='submit'>
                    Sign up
                </Button>
            </Box>
        </div>
    )
}