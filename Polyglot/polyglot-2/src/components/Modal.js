import '../App.css';
import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { HandleLogin, HandleSignUp } from './MyEventHandlers';
import { Vocab } from './Learner';
import { getAuth } from 'firebase/auth';
import MenuListComposition from './Menu';

export default function AddWord ({ onClose, eventHandler, updateVocab,      updateOrEdit, newWord, closeUpdateWord, editVocab}) {
    //TODO: use newWord for adding a word to vocab book
    // Test update word

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
                 <div>
                    <MenuListComposition closeUpdateWord={closeUpdateWord}
                    newWord={newWord}/>
                    <TextField 
                        id="any-word" label={newWord.wordType} name="any-word" variant="outlined" 
                        onChange={eventHandler}
                    />
                 </div>
                 }
    
                <div id='confirm-word'>
                    <Button variant="contained" onClick={() => {
                        // updateRows and db
                        if (updateOrEdit) {
                            updateVocab();
                        } else {
                            // replace with method from learner
                            editVocab();
                        }
                        // if it works it works ig
                        onClose();
                    }}>
                        Confirm
                    </Button>
                </div>
            </Box>
        </div>
    )
}

export function Register ({toggleSignIn, setError, setMessage}) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const usernameRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = await HandleSignUp(emailRef.current.value, passwordRef.current.value, usernameRef.current.value)

        // if there's an error
        if (message.success === null) {
            setError(true);
            setMessage(message.error);
        } else {
            setError(false);
            setMessage(message.success);
        }
    }

    return (
        <Box
            component="form"
            method='post'
            action='/checkUser'
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
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

export function LogIn({toggleSignIn, setError, setMessage}) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = await HandleLogin(emailRef.current.value, passwordRef.current.value)

        // if there's an error
        if (message.success === null) {
            setError(true);
            setMessage(message.error);
        } else {
            setError(false);
            setMessage(message.success);
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

// pass user if possible
export function NewCollection({ toggleNewCollectionModal }) {
    // get signed in user
    const auth = getAuth();
    const user = auth.currentUser;
    let vocab;

    if (user != null) {
        vocab = new Vocab(user);
    } else {
        console.log("user not signed in")
    }


    const collectionNameRef = useRef(null);
    const nativeRef = useRef(null);
    const translationRef = useRef(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(user.email);
            const result = await vocab.CreateVocabList(
                collectionNameRef.current.value, nativeRef.current.value, translationRef.current.value
            );
            alert(result);
        } catch (error) {
            alert("could not create new collection");
        }
        // if there's an error
        /* if (message.success === null) {
            setError(true);
            setMessage(message.error);
        } else {
            setError(false);
            setMessage(message.success);
        } */
        toggleNewCollectionModal(false);
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
            <h1>New Collection</h1>
            <div >
                <TextField
                id='vocab-collection-name'
                placeholder="Familiy"
                label='vocab-collection-name'
                variant='outlined'
                inputRef={collectionNameRef}
                />
            </div>
            <div >
                <TextField
                id='native'
                placeholder="native"
                label="native"
                variant="outlined"
                inputRef={nativeRef}
                />
            </div>
            <div >
                <TextField
                id='translation'
                placeholder="translation"
                label="translation"
                variant="outlined"
                inputRef={translationRef}
                />
            </div>
            <Button id="Confirm-word" variant="contained" type='submit'>
                Create collection
            </Button>
        </Box>
    )
}

