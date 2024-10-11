import '../App.css';
import { useRef, useState } from 'react';
import { BrowserRouter as Link, useNavigation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Learner } from './Learner';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { HandleLogin, HandleSignUp } from './MyEventHandlers';
import { Vocab } from './Learner';
import { getAuth } from 'firebase/auth';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuListComposition from './Menu';


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
       
        toggleNewCollectionModal(false);
    }

    return (
        <div className='overlay'>
            <Box
                id='create-collection-modal'
                className='my-modal'
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
        </div>
    )
}
export default function AddWord ({ closeModal, eventHandler, updateVocab, newWord}) {
    //TODO: use newWord for adding a word to vocab book
    // Test update word

    return (
        <div className='overlay'>
            <Box 
                id='new-word-modal'
                className='my-modal'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField 
                        id="outlined-basic-english" label="English" name="native" variant="outlined" onChange={eventHandler} 
                    /> 
                    <TextField 
                        id="outlined-basic-german" label="German" name="translation" variant="outlined" 
                        onChange={eventHandler}
                    />
                </div>
    
                <div id='confirm-word'>
                    <Button variant="contained" onClick={() => {
                        // updateRows and db
                        updateVocab();
                        // if it works it works ig
                        closeModal(1);
                    }}>
                        Confirm
                    </Button>
                </div>
            </Box>
        </div>
    )
}

export function EditWord({closeModal, eventHandler, newWord, closeUpdateWord, editVocab}) {

    return (
        <div className='overlay'>
            <Box 
                id='edit-word-modal'
                className='my-modal'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                 
                 { newWord.wordType === 'both' ? 

                    // When user wants to update both words
                    <div>
                        <MenuListComposition closeUpdateWord={closeUpdateWord}
                        newWord={newWord}/>
                        <TextField 
                            id="editNative" label="English" name="any-word" variant="outlined" onChange={eventHandler} 
                        /> 
                        <TextField 
                            id="editTrans" label="German" name="any-word" variant="outlined" 
                            onChange={eventHandler}
                        />
                    </div>: 

                    // when user wants to update one word
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
                        editVocab();
                        closeModal(2);
                    }}>
                        Confirm
                    </Button>
                </div>
            </Box>
        </div>
    )
}

//* Popover code 
// * ask user if they want to delete the word or not. call delete word from heft
export function DeleteWord({closeDeleteVocab, deleteVocab, open}) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };
      return (
        <Modal
            open={open}
             onClose={closeDeleteVocab}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete this word?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                If you delete this word you won't be able to get it back
            </Typography>
            <Button onClick={() => {
                closeDeleteVocab()
                deleteVocab()
            }}>
                Confirm
            </Button>
            </Box>
        </Modal>
      )
}

export function Register ({ setError, setMessage}) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const usernameRef = useRef(null);
    const user = new Learner();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO change to try/catch
        const message = await user.SignUp(emailRef.current.value, passwordRef.current.value, usernameRef.current.value)

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
                <p>Already have an account?</p> 
                <Link to="/signin">
                    sign in
                </Link>
                &nbsp; &nbsp;
                <Link to="/">
                    home
                </Link>
            </section>
        </Box>
    )
}

export function LogIn({ setError, setMessage, setUserState }) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const user = new Learner();
    

    const handleSubmit = async (e) => {
        
        try {
            const message = await user.LogIn(emailRef.current.value, passwordRef.current.value)

            setError(false);
            setMessage(message.success);  
            setUserState(true);          
        } catch (error) {
            setError(true);
            setMessage("Failed to login");
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
                <p>Don't have an account ?</p> 
                <Link to="/signup">
                    sign up
                </Link>
                &nbsp; &nbsp;
                <Link to="/">
                    home
                </Link>
            </section>
        </Box>
    )
}




