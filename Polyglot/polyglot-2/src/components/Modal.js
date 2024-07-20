import '../App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export default function AddWord ({ onClose, eventHandler, updateVocab}) {
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
                        // updateRows and db
                        updateVocab();
                        onClose();
                    }}>
                        Confirm
                    </Button>
                </div>
            </Box>
        </div>
    )
}

export function Register ({handleSave, emailRef, passwordRef, usernameRef,toggleSignIn}) {
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
            <h1>Sign Up</h1>
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
            <section>
                <p onClick={toggleSignIn}>Log in</p>
            </section>
        </Box>
    )
}

export function LogIn({toggleSignIn, handleLogin, emailRef, passwordRef}) {
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleLogin}
            >
            <h1>Log In</h1>
            <div >
                <TextField
                id='outlined-basic-email'
                placeholder="carlos@gmail.com"
                label="Email"
                variant="outlined"
                inputRef={emailRef}
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
                Log in
            </Button>
            <section>
                <p onClick={toggleSignIn}>Sign up</p>
            </section>
        </Box>
    )
}

