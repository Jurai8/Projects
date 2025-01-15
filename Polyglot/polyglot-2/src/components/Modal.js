import '../App.css';
import Box from '@mui/material/Box';
import { Learner } from '../functions/Learner';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Vocab } from '../functions/vocab';
import { getAuth } from 'firebase/auth';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuListComposition from './Menu';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useFetchVocab from '../hooks/useVocab';


// pass user if possible
export function NewCollection({ toggleNewCollectionModal }) {
    // get signed in user
    const auth = getAuth();
    const user = auth.currentUser;
    let vocab;

    if (user != null) {
        vocab = new Vocab(user);
    } else {
        console.log("user not signed in hehe")
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
                    <Button variant="contained" onClick={async () => {
                        // updateRows and db
                        await updateVocab();
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

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({
                email: emailRef.current.value, 
                password: passwordRef.current.value, 
                username: usernameRef.current.value
            })

        } catch (error) {
            setError(true);
            setMessage("Could not create account");
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
            </section>
        </Box>
    )
}

export function LogIn({ setError, setMessage, setStatus }) {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ 
                email: emailRef.current.value, 
                password: passwordRef.current.value 
            })        
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
            </section>
        </Box>
    )
}



export function BeginTest({ open, closeModal }) {

    const navigate = useNavigate();
  
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    return (
        <>
            <Modal
            open={open}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Button onClick={() => 
                    navigate('/vocablists', { state: true }
                    )}>
                    Start new Test
                </Button>
                <Button>Check Schedule</Button>
            </Box>
            </Modal>
            
        </>
    )
}

// Display a modal which contains data pertaining to a specific word
export function WordInfoModal({ displayInfo, wordInfo }) {
    const { user } = useAuth();
    // this function will get all the info on a specific word
    const { getInfo, error } = useFetchVocab(user);
    const [wordData, setWordData] = useState({})

    // get the name of the current list
    const location = useLocation();
    const pathname = location.pathname;
    // make sure to only get the name of the list
    const listName = pathname.slice(12);


    // used to store all the info on the word

    // regulate when getInfo should be called
    useEffect(() => {
        const callGetInfo = async () => {
            // if the modal should open, call getInfo
            if (wordInfo.show === true) {
                // vocabRef.current should have the values: POS, translation, word and definition
                console.log("retrieving info on word")
                const vocabInfo = await getInfo(listName, wordInfo.word);
                
                setWordData(vocabInfo)
            }
        }

       return () => callGetInfo();
        
    }, [wordInfo, listName, getInfo])

    const [childModal, setChildModal] = useState(false);
    

    const openChildModal = () => {
        console.log("opening modal")
        setChildModal(true)
    };
    const closeChildModal = () => setChildModal(false);

    //TODO: work on design of the box
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div className='word-info-modal' aria-hidden="false" aria-modal="true">

            <Modal
                open={wordInfo.show}
                onClose={() => displayInfo(false)}
                /* open  & close modal */ 
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={style}>

                {/* display something if error is true */ }
                {wordData ? 
                <>
                    <h2 onClick={() => {console.log("clicked")}}> Info </h2>

                    <div id='word-label-container'>
                        <div id='word-label-left'>
                            <label className='word-label'> Word: </label>

                            <div id='word-sec-left'> 
                                <span > {wordData.word} </span>
                                <EditIcon 
                                    className='edit-icon' 
                                    sx={{ fontSize: 15 }}
                                    onClick={() => {openChildModal()}} 
                                />
                            </div>
                            
    
                        </div>

                        <div id='word-label-right'>
                            <label className='word-label'> Translation: </label>

                            <div id='word-sec-right'>
                                <span > {wordData.translation} </span>
                                <EditIcon 
                                    className='edit-icon' 
                                    sx={{ fontSize: 15 }} 
                                    onClick={() => {openChildModal()}}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <Divider/>
                    <div id='def-container'>
                        <div>
                            <label className='word-label'> Definition: </label>
                        </div>
                    
                        <div id='definition'>
                            <span>{wordData.definition}</span>
                            <EditIcon 
                                className='edit-icon' 
                                sx={{ fontSize: 15 }} 
                                onClick={() => {openChildModal()}}
                            />
                        </div>
                    </div>
                    
                    <Divider/>
                    <div id='pos-container'>
                        <div>
                            <label className='word-label'> POS: </label>
                        </div>
                        
                        <div id='POS'>
                            <select>
                                <option value="none">None</option>
                                <option value="noun">Noun</option>
                                <option value="verb">Verb</option>
                                <option value="article">Article</option>
                                <option value="adjective">Adjective</option>
                                <option value="pronoun">Pronoun</option>
                                <option value="adverb">Adverb</option>
                                <option value="conjunction">Conjunction</option>
                                <option value="preposition">Preposition</option>
                                <option value="interjection">Interjection</option>
                                <option value="contraction">Contraction</option>
                                <option value="numeral">Numeral</option>
                                <option value="proper-noun">Proper-Noun</option>
                                
                            </select>
                        </div>
                    </div>
                
                    <WordInfoModalChild open={childModal} close={closeChildModal}/>

                    <Button onClick={() => {displayInfo(false)}}>
                        close
                    </Button>

                </> : 
                    <>
                        {/* show a loading screen if vocabRef.current isn't initialized */}
                        <h2> Loading....</h2>
                    </>
                    
                }
                
            </Box>
            </Modal>
        </div>
    )
    
}

export function WordInfoModalChild({open, close}) {

    const style = {
        display: 'grid',
        justifyContent: 'center',
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
    <div>
      <Modal
        open={open}
        onClose={() => {close()}}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200, }}>
            <div id='c-modal-title-container'>
                <h2 id="child-modal-title">Translation</h2>
            </div>
            <TextField 
                id="standard-basic"
                variant="standard" 
                size='small' 
                placeholder='Hallo'
                multiline
          />
          <Button onClick={() => {close()}}>Save</Button>
        </Box>
      </Modal>
    </div>
  );
}