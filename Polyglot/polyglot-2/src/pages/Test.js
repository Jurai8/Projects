import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import React, { useState, useEffect, useMemo, useCallback} from 'react';
import { useAuth } from '../hooks/useAuth';
import useFetchVocab from '../hooks/useVocab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Test } from '../functions/test';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import { Vocab } from '../functions/vocab';
import useTest from '../hooks/useTest';


//TODO: create a collection to store words that user wants to be tested on in the future. User should be able to select individual words to be tested on within a vocab collection (?) or they can get tested on the entire collection

// the "home page" so to speak
export function TestIndex() {
    // the user should see 2 buttons to schedule and start a test
    // the user should a see a table of scheduled tests

    const [TestTypeModal, setTestTypeModal] = useState(false);

    const openTestTypeModal = () => {
        setTestTypeModal(true);
    }

    const closeTestTypemodal = () => {
        setTestTypeModal(false);
    }


    // TODO: should i wrap the use location in a useMemo/useEffect?
        //? useEffect causes the variable to be redefined each time i update the source code
    // TODO: pass listname directly to TestLearner so that they can begin the test
    // const { state } = useLocation();
    // {state && <h2>List: { state.listName }</h2>}

    return (
        <>
            <h1>Test</h1>

            <TestType open={TestTypeModal} close={closeTestTypemodal}></TestType>

            <div >
                <Button onClick={openTestTypeModal}>Start a Test</Button>
                <Button>Schedule Test</Button>
            </div>
        </>
    );
}


// TODO: create test scheduler


export function TestLearner() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { user } = useAuth();

    const { getVocab } = useFetchVocab(user);

    // Check if user is correct. Iterate through vocab. Manage scores
    const { isCorrect, count, score, randomize, reset, mistakes
    } = useTest(state.listName);

    // current word to be displayed
    const [word, setWord] = useState('');

    // user answer
    const [input, setInput] = useState('');

    // keep track of whether test has started or not
    const [begin, setBegin] = useState(null);

    // vocab to be tested against
    const [vocabulary,setVocabulary] = useState([]);

    const [vocabType, setVocabType] = useState("")

    
    // get the vocab to be tested on
    useEffect(() => {
        const getwords = async () => {
            try {
                const words = await getVocab(state.listName, state.testType);

                console.log("words: ", words)

                if (state.testType === "definition") {
                    // definition the user is being compared against the word the give per definition.
                    setVocabType("translation");
                } else {
                    setVocabType(state.testType);
                }

                
                setVocabulary(randomize(words));

            } catch (error) {
                // send user to an error page?
                throw new Error(error);
            }
        }

        getwords();

    },[state.listName, getVocab, state.testType, randomize])

    // update which word is being shown and end the test when all values have been shown
    useEffect(() => {

        // Ensure vocabListRef.current is not empty before trying to access it
        // also make sure count doesn't reach an undefined index
        if (vocabulary.length > 0 && count < vocabulary.length) {
            // when count changes show the word at index "count"
            // ? The word shown needs to correspond to the test.
            setWord(vocabulary[count].main);
        } 

        // end test after going through the list
        if (vocabulary.length > 0 && count === vocabulary.length) {
            setBegin(false)
        }

    }, [count,vocabulary])


    // use to begin/restart a test
    const beginTest = () => {
        setBegin(true);

        // set count and score to 0
        reset();
    }


    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleConfirmClick = () => {

        console.log("VocabType:", vocabType, typeof vocabType);

        // check if user input the correct answer
        // compare the value they're being tested against with their answer
        // state.testType could be "translation", "pos" etc
        isCorrect(vocabulary[count][vocabType], input);


        setInput(''); // Clear the input field after adding to the array
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent form from submitting and causing a reload
    };

    // control which buttons to display based on the state of begin
    function DisplayButtons({begin}) { 
        return (
            <>
                {begin === null ? (
                    <Button variant="contained" onClick={() => {
                        beginTest()
                    }}>
                        Begin
                    </Button>
                ) : (
                    begin === true ? (
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                if (begin) {
                                    handleConfirmClick()
                                } else {
                                    return null;
                                }        
                            }}>
                            Confirm
                        </Button>
                    ) : (
                        <>
                            <Button variant="contained" onClick={() => {
                                setVocabulary(randomize(vocabulary));
                                beginTest();
                            }}>
                                restart
                            </Button>

                            {/* rout user to indexTest */}
                            <Button variant="contained" onClick={() => {
                                // ? don't allow the user to go back ?
                                navigate("/test")
                            }}
                            >
                                End
                            </Button>
                        </>
                    )
                )}
            </>
        )
    }   

    function DisplayMistakes() {
        return (
            <>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Your answer</TableCell>
                        <TableCell align="right">Correct answer</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {mistakes.map((row, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.userAnswer}
                        </TableCell>

                        <TableCell align="right">
                            {row.correctAnswer}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    
                </Table>
                </TableContainer>
            </>
        )
    }

    return (
        <div>
            {/* should be variable */}

            {state && 
                <>
                    <h1>Test: {state.testType}</h1>
                    <h1>List: {state.listName}</h1>
                </>
            }

            {/* display "word" upon entering the page */}
            {begin === null ? (
                <h1>Goodluck</h1>
                // if begin != null 
            ) : (
                begin === true ? (
                    <>
                        <h1> Word: {word} </h1>
                    </>
                ): (
                    <>
                        <h1> Score: {score} / {vocabulary.length} </h1>

                        {/* only show if they've made any mistake */}
                        {mistakes.length > 1 &&
                            <DisplayMistakes />
                        }
                        
                    </>
                   
                )
            )}


            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleFormSubmit}
                >

                {begin &&
                    <TextField id="standard-basic" label="Standard" variant="standard" type='text' value={input} onChange={handleInputChange}/> 
                }
                

                <DisplayButtons begin={begin}/>

            </Box>

        </div>
    )
}


//This is where the user will choose which test to write.
function SelectTest() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [options, setOptions] = useState([])

    const handleNavigation = (listName) => {
        navigate(`/test/${listName}`, {
            state: {
                testType: location.state.testType,
                listName: listName
            },
            replace: true  // This prevents going back
        });
    };

    useEffect(() => {
        const getLists = async () => {
            if (user) {
                const vocab = new Vocab(user);

                try {
                    const vocabLists = await vocab.getAllVocabLists();
                    setOptions(vocabLists);
                } catch (error) {
                    console.error("Error fetching vocab lists:", error);
                }
            } else {
                console.log("User is signed out");
                alert("Test: not signed in yet");
            }
        };

        getLists(); 
    }, []);
    
    return (
        <div>
            <Typography variant='h5'> Select your vocab list</Typography>
            {options.map((list,index)=>(
                <List key={index}>
                    {/*pass test type and listName to TestLearner */}

                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => {handleNavigation(list.listName)}}
                        >
                            <ListItemText primary={list.listName}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            ))}
        </div>
    )
}



export {SelectTest}

// after the user selects the test, they then select the list
function TestType({ open, close }) {
    // modal
    // options:
        // Pos test
        // definition test
        // translation test

        const navigate = useNavigate();

        const handleNavigate = (testType) => {
            navigate("/test/select-list", { state: { testType: testType } });
        }


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
        <div>
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Select test type
                    </Typography>

                    <Divider />
                    <nav aria-label="test types">
                        {/*go to page where user selects list to be tested on
                            pass the test type too so that i can be used when getting the vocab
                         */}
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    handleNavigate("translation")
                                }}>
                                    <ListItemText primary="Translation"/>
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    handleNavigate("pos")
                                }}>
                                    <ListItemText primary="Parts of Speech"/>
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton onClick={() => {
                                    handleNavigate("definition")
                                }}>
                                    <ListItemText primary="Definitions" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </nav>
                </Box>
            </Modal>
        </div>
    );

    
}


