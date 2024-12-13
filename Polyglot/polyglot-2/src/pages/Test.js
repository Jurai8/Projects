import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { BeginTest } from '../components/Modal';
import { Test } from '../functions/test';
import { Vocab } from '../functions/vocab';
import { useAuth } from '../hooks/useAuth';
import React, { useState, useEffect, useMemo} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

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


// TODO: create test test scheduler


export function TestLearner() {
    const { state } = useLocation();
    const navigate = useNavigate();

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
    const [begin, setBegin] = useState(null)
    // vocab list to be tested against
    const [vocabListRef,setVocabListRef] = useState([]);

    // TODO: check if i need to do any data cleanups


    const vocabTest = useMemo(() => {
        return new Test(user);
    }, [user])

    
    useEffect(() => {
        const getwords = async () => {
            try {
                const words = await vocabTest.getVocab(state.listName);

                const uniqueWords = words.filter((word, index, self) =>
                    index === self.findIndex(w => 
                        w.native === word.native && w.translation === word.translation
                    )
                );

                setVocabListRef(uniqueWords);

            } catch (error) {
                console.error(error)
            }
        }

        getwords();
    },[vocabTest,state])

    useEffect(() => {
        console.log("score:", score, "Count: ", count, "Vocab:", vocabListRef.length)
        // Ensure vocabListRef.current is not empty before trying to access it
        if (count != null && vocabTest.verifyWordSet(vocabListRef, count)) {
            // when count changes show value at index "count"
            console.log("hello")
            setWord(vocabListRef[count].native);
        } 

        if (count === vocabListRef.length) {
            setBegin(false)
        }
    }, [score,count,vocabTest,vocabListRef])

    useEffect(() => {
        console.log("begin", begin)
    }, [begin])

    // use to begin/restart a test
    const beginTest = () => {
        setBegin(true);

        setCount(0);

        setScore(0);
    }

    const randomizeArray = (array) => {

        const random = vocabListRef;

        // Iterate over the array in reverse order
        for (let i = random.length - 1; i > 0; i--) {
    
            // Generate Random Index
            const j = Math.floor(Math.random() * (i + 1));
    
            // Swap elements
            [random[i], random[j]] = [random[j], random[i]];
        }

        // update the original array
        setVocabListRef(random);
    }


    const handleInputChange = (event) => {
        
        setInput(event.target.value);
    };

    const handleConfirmClick = () => {
        console.log("compare")

        // check if user input the correct
        if(vocabTest.checkAnswer(vocabListRef[count].translation, input)) {
            setScore(score+1)
        }

        setInput(''); // Clear the input field after adding to the array
        setCount((prevCount) => prevCount + 1);
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
                                randomizeArray()
                                beginTest()
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

    return (
        <div>
            {state && <h1>{state.listName}</h1>}

            {/* display "word" upon entering the page */}
            {begin === null ? (
                <h1> Word: {word} </h1>

                // if begin != null 
            ) : (
                begin === true ? (
                    <h1> Word: {word} </h1>
                ): (
                    <h1> Score: {score} / {vocabListRef.length} </h1>
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
                <TextField id="standard-basic" label="Standard" variant="standard" type='text' value={input} onChange={handleInputChange}/> 

                <DisplayButtons begin={begin}/>

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