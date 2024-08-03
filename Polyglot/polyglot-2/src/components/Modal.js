import '../App.css';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { EditWord } from './MyEventHandlers';
import { HandleLogin, HandleSignUp } from './MyEventHandlers';


export default function AddWord ({ onClose, eventHandler, updateVocab,      updateOrEdit}) 
    {
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
                 
                 { updateOrEdit ? 
                 // if user adds new word
                    <div>
                        <TextField 
                            id="outlined-basic-english" label="English" name="native" variant="outlined" onChange={eventHandler} 
                        /> 
                        <TextField 
                            id="outlined-basic-german" label="German" name="translation" variant="outlined" 
                            onChange={eventHandler}
                        />
                    </div>: 
                 // if the want to edit an existing word
                    <TextField 
                        id="any-word" label="any-word" name="any-word" variant="outlined" 
                        onChange={eventHandler}
                    />
                 }
    
                <div id='confirm-word'>
                    <Button variant="contained" onClick={() => {
                        // updateRows and db
                        if (updateOrEdit) {
                            updateVocab();
                        } else {
                            EditWord();
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

export function Register ({toggleSignIn, setError, setSuccess}) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const usernameRef = useRef(null);

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={ () => {
                const message = HandleSignUp(emailRef.current.value, passwordRef.current.value, usernameRef.current.value)

                if (message.success === null) {
                    setError(message.error);
                } else {
                    setSuccess(message.success)
                }
            }
            }>
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
                type='password'
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

export function LogIn({toggleSignIn, setError, setSuccess}) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = await HandleLogin(emailRef.current.value, passwordRef.current.value)

        console.log(message);

        if (message.success === null) {
            setError(message.error);
        } else {
            setSuccess(message.success)
        }
    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
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
                type='password'
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

