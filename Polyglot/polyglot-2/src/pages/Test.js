import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MyButton from "../components/Button";
import { BeginTest } from '../components/Modal';
import { Test } from '../functions/test';
import { Vocab } from '../functions/vocab';
import { useAuth } from '../hooks/useAuth';
import React, { useRef, useState, useEffect, useMemo} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import e from 'express';


//TODO: create a collection to store words that user wants to be tested on in the future. User should be able to select individual words to be tested on within a vocab collection (?) or they can get tested on the entire collection

// the "home page" so to speak
export function TestIndex() {
    // the user should see 2 buttons to schedule and start a test
    // the user should a see a table of scheduled tests
    const [open, setOpen] = useState(false);
    const OpenBeginTestModal = () => setOpen(true);
    const CloseBeginTestModal = () => setOpen(false);

    // TODO: should i wrap the use location in a useMemo/useEffect?
        //? useEffect causes the variable to be redefined each time i update the source code
    // TODO: pass listname directly to TestLearner so that they can begin the test
    // const { state } = useLocation();
    // {state && <h2>List: { state.listName }</h2>}

    return (
        <>
            <h1>Test</h1>

            <BeginTest open={open} closeModal={CloseBeginTestModal} />
            <div >
                <Button onClick={OpenBeginTestModal}>Start a Test</Button>
                <Button>Schedule Test</Button>
            </div>
        </>
    );
}






export function TestLearner() {
    const { state } = useLocation();

    const { user } = useAuth();

    // current word to be displayed
    const [word, setWord] = useState('');
    // move through vocablist indices
    const [count, setCount] = useState(null);
    // user answer
    const [input, setInput] = useState('');
    // user score
    const [score, setScore] = useState(0);
    // keep track of whether test has started or not
    const [begin, setBegin] = useState(false)
    // vocab list to be tested against
    const vocabListRef = useRef([]);

    const vocabTest = useMemo(() => {
        return new Test(user);
    }, [user])

    useEffect(() => {
        console.log(vocabTest.getScore())
        // Ensure vocabListRef.current is not empty before trying to access it
        if (vocabTest.verifyWordSet(vocabListRef.current, count)) {
            // when count changes show value at index "count"
            setWord(vocabListRef.current[count].native);
        }
    }, [count,vocabTest])

    const initializeVocab = async () => {
        const newWords = await vocabTest.getVocab(state.listName);
        vocabListRef.current = newWords;
        // Reset count to 0 to start from the first word
        setCount(0);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleConfirmClick = (e) => {
        setInput(''); // Clear the input field after adding to the array
        setCount((prevCount) => prevCount + 1);
    };

   const compare = () => {
        console.log("compare")
       if(vocabTest.checkAnswer(vocabListRef.current[count].translation, input)){
        setScore(score+1)
       }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent form from submitting and causing a reload
    };


    return (
        <div>
            {state && <h1>{state.listName}</h1>}

            {count === (vocabListRef.current.length) ?
                <h1> Score: {score} / {vocabListRef.current.length} </h1> : <h1> Word: {word} </h1>
            }
             
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleFormSubmit}
                >
                <TextField id="standard-basic" label="Standard" variant="standard" type='text' value={input} onChange={handleInputChange}/> 

                <Button 
                    variant="contained" 
                    onClick={() => {
                        if (begin) {
                            compare()
                            handleConfirmClick()
                        } else {
                            return null;
                        }        
                    }}
                >
                    Confirm
                </Button>

                <Button variant="contained" onClick={() => {
                    setBegin(true)
                    initializeVocab()  
                }}>
                    Begin
                </Button>
            </Box>
        </div>
    )
}


//This is where the user will choose which test to write.
function SelectTest(){
    const { user } = useAuth();
    const [options, setOptions] = useState([])

    useEffect(() => {
        const getLists = async () => {
            if (user) { 
                const vocab = new Vocab(user)

                try {
                    const vocabLists = await vocab.getAllVocabLists();
                    setOptions(vocabLists);
                } catch (error) {
                    console.error("Error fetching vocab lists:", error);
                }
            } else {
                
                console.log("User is signed out");
                // TODO: use an alert or a redirect, for the user?
                alert("Test: not signed in yet");
            }
        }
        
       return () => getLists();
    },[])
    
    
    return (
        <div>
            <Typography variant='h5'> Select your vocab list</Typography>
            {options.map((list,index)=>(
                <li key={index}>
                    <Link to={'/test/'+ list.listName}>{list.listName}</Link>
                </li>
            ))}
        </div>
    )
}



export {SelectTest}