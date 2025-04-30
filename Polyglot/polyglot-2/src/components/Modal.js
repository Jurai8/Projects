import '../App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Vocab } from '../functions/vocab';
import { getAuth } from 'firebase/auth';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuListComposition from './Menu';
import { useEffect, useRef, useState, useReducer } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useFetchVocab from '../hooks/useVocab';
import { useSetVocab } from '../hooks/useVocab';
import MoreVertIcon from '@mui/icons-material/MoreVert';


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





// Display a modal which contains data pertaining to a specific word
export function WordInfoModal({ close, open, word }) {

    //! replace display info with "close"
    //! split wordInfo into "open" and "word"
    //! instead of pathname use state

    // TODO: make sure the user can't edit unless they click "edit"
        // manipulate the css?
        
    const { user } = useAuth();

    // get the name of the current list
    const location = useLocation();
    const pathname = location.pathname;

    // make sure to only get the name of the list
    const listName = pathname.slice(12);

    // this function will get all the info on a specific word
    const { getInfo, error, reload } = useFetchVocab(user);

    const { editVocab, deleteVocab } = useSetVocab(user);


    const [wordData, setWordData] = useState({});

    const [copyWordData, setCopyWordData] = useState({});

    const [childModal, setChildModal] = useState(false);

    // open modal asking user to save changes
    const [isSaveChangesModal, setisSaveChangesModal] = useState(false);

    // track which functions need to be called
    // contains the names of the fields that need to be updated
    const [trackChanges, setTrackChanges] = useState([])

    // used to create a dynamic modal. if they're editing translation, the heading title will be translation and the placholder will be the current word
    const [edits, setEdits] = useState({
        title: "",
        dbField: "",
        placeholder: ""
    })

    // set to true when the user begins making changes
    const [isEditing, setIsEditing] = useState(false);

    // TODO: replace with trackchanges? track if any changes have been made
    const unsavedEdits = (trackchanges) => {
        // if there are changes which haven't been saved
        if (trackChanges) {
            // display modal
            openSaveChangesModal();
            // set displayInfo(false);
        }

        // if there are no changes
        if (!trackChanges || trackChanges.length === 0) {
            // close the modal
            close()
        }
    }

    const handlePosChange = (e) => {
        console.log(e.target.value);
        // TODO: track changes, update wordData correctly
        // Make sure i'm not updating with the exact same value
        if (edits.placeholder !== e.target.value) {
            setEdits({
                title: "POS",
                dbField: "POS",
                placeholder: e.target.value
            })

            setWordData((prevData) => ({
                ...prevData, // Preserve all existing fields
                POS: e.target.value, 
            }));
        }

        // if the pos field is not yet included
        if (!trackChanges.includes("POS")) {
            // track changes
            setTrackChanges((prevField) => [...prevField, "POS"])
        }
    } 

    // set everything back to original state, i.e revert all changes
    const revertChanges = () => {
        // set wordData back to it's original state
        //? do i need to? the state seems to go back to it's original version if I don't save the changes in the db
        setWordData(copyWordData);
        setTrackChanges([]);
        setEdits({
            title: "",
            dbField: "",
            placeholder: ""
        })
        setIsEditing(false);
    }

    // the user wants to save their changes
    const saveChanges = async () => {


        // TODO: If trackchanges is empty 
        if (!trackChanges || trackChanges.length === 0) {
            setIsEditing(false);
            return;
        }
       


        const { 
            editSource, editTrans, editDefinition, editPOS, editExample
        } = editVocab(listName, copyWordData, wordData);
        // copyWordData = old version
        // wordData = updated version

        console.log("saving changes")
        // use the functions from the hook to save changes to the db

        console.log("trackchanges", trackChanges);
        
        for (const field of trackChanges) {

            switch (field) {
                case "word":
                    await editSource();
                    console.log("updated source word successfully");
                    break; 
                case "translation":
                    await editTrans();
                    console.log("updated translation successfully",);
                    break;
                        
    
                case "definition":
                    await editDefinition();
                    console.log("updated definition successfully");
                    break;
                    
                case "POS":
                    await editPOS();
                    console.log("updated POS successfully")
                    break;

                case "example":
                    await editExample();
                    console.log("updated example successfully")
                    break;

                default:
                    // set error true
                    // throw error
                    console.log("No changes.");
                    break;
            }
        }

        // reset fields that have been updated 
        setTrackChanges([]);

        // after the changes have been saved reset isEditing
        setIsEditing(false);
    }

    // Dynamically update wordInfo per field
    const setUserInput = (field, input) => {
        // if the user input is empty/ not a string
        if (!input) {
            // don't update anything
            return;
        } else {
            console.log("setting user input")
            setWordData((prevData) => ({
                ...prevData, // Preserve all existing fields
                [field]: input, // Dynamically Update the specific field
            }));
    
            // track which fields are being updated
            // ensure there's no duplicate field inputs
            if (!trackChanges.includes(field)) {
                setTrackChanges((prevField) => [...prevField, field])
            }
            
        }
    }

    // open and close the save changes modal 
    const openSaveChangesModal = () => setisSaveChangesModal(true);
    const closeSaveChangesModal = () =>  setisSaveChangesModal(false);


    // regulate when getInfo should be called
    useEffect(() => { 

        const callGetInfo = async () => {
            
            console.log("hi: ", word);
            // if the modal should open, call getInfo
            if (open && word) {
                console.log("wordInfo:", word);
                // vocabRef.current should have the values: POS, translation, word and definition

                console.log("retrieving info on word");

                try {
                    const vocabInfo = await getInfo(listName, word);

                    setWordData(vocabInfo);
                    // save a copy of the original state, as wordData will be updated
                    setCopyWordData(vocabInfo);
                } catch (error) {
                  console.error("could not get vocab data", error)  
                }     
            }

        }

        callGetInfo();
        
    }, [word, open, listName, getInfo ])


            
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
                open={open}
                // TODO: check if user has made any edits
                onClose={() => close()}
                /* open  & close modal */ 
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

            <Box sx={style}>

                {/* display something if error is true */ }
                {/* //TODO: include "x" at the top left corner for user to exit modal. track whether any changes have been made */}
                {wordData ? 
                <>

                    <h2> Info </h2>

                    <div id='word-label-container'>
                        <div id='word-label-left'>
                            <label className='word-label'> Word: </label>

                            <div id='word-sec-left'> 
                                <span > {wordData.word} </span>
                                {/* only render if isEditing is true */}
                               { isEditing &&
                                    <EditIcon 
                                        className='edit-icon' 
                                        sx={{ fontSize: 15 }}
                                        onClick={() => {
                                            setEdits({
                                                title: "Source Word",
                                                dbField: "word",
                                                placeholder: wordData.word
                                            })
                                            openChildModal()
                                        }} 
                                    />
                                }
                            </div>
    
                        </div>

                        <div id='word-label-right'>
                            <label className='word-label'> Translation: </label>

                            <div id='word-sec-right'>
                                <span > {wordData.translation} </span>
                                {/* only render if isEditing is true */}
                               {isEditing &&
                                    <EditIcon 
                                        className='edit-icon' 
                                        sx={{ fontSize: 15 }} 
                                        onClick={() => {
                                            setEdits({
                                                title: "Translation",
                                                dbField: "translation",
                                                placeholder: wordData.translation
                                            })
                                            openChildModal()
                                        }}
                                    />
                                }
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

                            {/* //: only render if isEditing is true */}
                            {isEditing &&  
                                <EditIcon 
                                    className='edit-icon' 
                                    sx={{ fontSize: 15 }} 
                                    onClick={() => {
                                        setEdits({
                                            title: "Definition",
                                            dbField: "definition",
                                            placeholder: wordData.definition
                                        })
                                        openChildModal()
                                    }}
                                />
                            }
                           
                        </div>
                    </div>

                    <Divider/>
                    <div id='def-container'>
                        <div>
                            <label className='word-label'> Example: </label>
                        </div>
                    
                        <div id='example'>
                            <span>{wordData.example}</span>
                            {/* only render if isEditing is true */}
                            {isEditing && 
                                <EditIcon 
                                    className='edit-icon' 
                                    sx={{ fontSize: 15 }} 
                                    onClick={() => {
                                        setEdits({
                                            title: "Example",
                                            dbField: "example",
                                            placeholder: wordData.example
                                        })
                                        openChildModal()
                                    }}
                                />
                            }
                        </div>
                    </div>
                    
                    <Divider/>
                    <div id='pos-container'>
                        <div>
                            <label className='word-label'> POS: </label>
                        </div>
                        
                        <div id='POS'>
                            <select name='selectedPOS' 
                                defaultValue={wordData.POS} 
                                onChange={(e) => handlePosChange(e)}
                            >
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
                
                    <WordInfoModalChild 
                        open={childModal} 
                        close={closeChildModal} 
                        edits={edits} 
                        setUserInput={setUserInput}
                        />

                    <SaveChangesModal 
                        open={isSaveChangesModal}
                        close={closeSaveChangesModal}
                        revertChanges={revertChanges}
                        saveChanges={saveChanges}
                    />

                    <div sx={{ display: 'flex'}}>

                        {isEditing  ? (
                            <>
                                {/* //TODO: first check if any changes have been made when executing the function */}
                                <Button onClick={() => {unsavedEdits(trackChanges)}}>
                                    Done
                                </Button>

                                {/* // TODO: add functionality to delete word*/}
                                <Button onClick={() => {deleteVocab(listName, copyWordData)}}>
                                    Delete
                                </Button>
                            </> 
                        ):(
                            <>
                                <Button onClick={() => {close()}}>
                                    close
                                </Button>

                                <Button onClick={() => setIsEditing(true)}>
                                    edit
                                </Button>
                            </>

                        )

                        }
                        
                    </div>
                   

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

// allows user to edit word data
export function WordInfoModalChild({open, close, edits, setUserInput }) {

    // track input change when user wants to change word info
    const [input, setInput] = useState('');
    
    const handleInputChange = (event) => {
        setInput(event.target.value);
    }

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
    <Modal
        open={open}
        onClose={() => {close()}}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
    >
        <Box sx={{ ...style, width: 200, }}>
            <div id='c-modal-title-container'>
                <h2 id="child-modal-title">{edits.title}</h2>
            </div>

           
            <TextField 
                id="standard-basic"
                variant="standard" 
                size='small' 
                placeholder={edits.placeholder}
                multiline
                onChange={handleInputChange}
            />
            {/* when the save button is clicked, start tracking changes */}
            {/* update wordData when user clicks save  */}
            <Button onClick={() => {
                console.log("input:", input);
                setUserInput(edits.dbField, input);
                setInput('');
                close();
            }}>
                Done
            </Button>
        </Box>
    </Modal>

  );
}

function SaveChangesModal({ open, close, revertChanges, saveChanges }) {

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
        <Modal
        open={open}
        onClose={() => {close()}}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
    >
        <Box sx={{ ...style, width: 200, }}>
            <div id='c-modal-title-container'>
                <p> Close without saving changes? </p>
            </div>
           
            <Button onClick={() => {
                // TODO: ensure that both modals close
                close();
                revertChanges()
            }}>
                Yes
            </Button>

            <Button onClick={() => {
                //TODO: close or refresh the previous modal
                close();
                saveChanges()
            }}>
                Save changes
            </Button>
        </Box>
    </Modal>

    )
}