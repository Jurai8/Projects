import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Register } from '../components/Modal';
import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';

import { firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore";



export default function SignUp () {
    const messageRef = useRef();
    // collection name = user
    const ref = collection(firestore, "user")

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(messageRef.current);

        let data = {
            message: messageRef.current.value,
        }

        try {
            addDoc(ref, { data });
            console.log('Document successfully written!');
        } catch(e) {
            console.log(e);
            console.log('Unsuccessful!');
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
                />
            </div>
            <div >
                <TextField
                id='outlined-basic-username'
                label="Username"
                variant="outlined"
                type='text'
                inputref={messageRef}
                />
            </div>
            <div>
                <TextField
                id='outlined-basic-password'
                label="Password"
                variant="outlined"
                />
            </div>
            <Button id="Confirm-word" variant="contained" type='sumbit'>
                Sign up
            </Button>
        </Box>
        </div>
    )
}