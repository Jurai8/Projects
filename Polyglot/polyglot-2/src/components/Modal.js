import '../App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { firestore } from '../firebase';
import { addDoc, collection } from "@firebase/firestore"


export default function AddWord ({ onClose, eventHandler, updateRows}) {
    return (
        <div className='overlay'>
            <Box 
                className='new-word-modal'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                 {/* set the value with onChange */}
                <TextField 
                    id="outlined-basic-english" label="English" name="native" variant="outlined" onChange={eventHandler} 
                />
                <TextField 
                    id="outlined-basic-german" label="German" name="translation" variant="outlined" 
                    onChange={eventHandler}
                 />
    
                <div id='confirm-word'>
                    <Button variant="contained" onClick={() => {
                        if (!updateRows()) {
                            alert("Please add a word");
                        } else {
                            updateRows();
                        }
                        onClose();
                    }}>
                        Confirm
                    </Button>
                </div>
            </Box>
        </div>
    )
}

/* 
export function Register () {
    return (
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
                ref={messageRef}
                />
            </div>
            <div >
                <TextField
                id='outlined-basic-username'
                label="Username"
                variant="outlined"
                ref={messageRef}
                />
            </div>
            <div>
                <TextField
                id='outlined-basic-password'
                label="Password"
                variant="outlined"
                ref={messageRef}
                />
            </div>
            <Button id="Confirm-word" variant="contained" type='sumbit' >
                Sign up
            </Button>
        </Box>
    )
}
*/