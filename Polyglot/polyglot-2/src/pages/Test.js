import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { FetchVocab } from '../components/MyEventHandlers';


// This is the vocab test

// compare the word that they write against the word that they have saved
// if they are the same  +1 point else -1 point
// at the end give them their score/percentage 
// show words that they got incorrect

// first hardcode

export default function Test() {
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
   

    useEffect(() => {
        // when count changes show value at index "count"
        setWord(vocabListRef.current[count])
    }, [count])

    const initializeVocab = async () => {
        const newWords = await FetchVocab();
        vocabListRef.current = newWords;
        // Reset count to 0 to start from the first word
        setCount(0)
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleConfirmClick = () => {
        /* setAnswers((prevAnswers) => [...prevAnswers, input]); */
        setInput(''); // Clear the input field after adding to the array
        setCount((prevCount) => prevCount + 1);
    };

   const compare = () => {
        if (vocabListRef.current[count] === input) {
            setScore((prevScore) => prevScore + 1 );
        }
        return;
    }

    return (
        <div>
            {count === (vocabListRef.current.length) ?
                <h1> Score: {score} / 3</h1> : <h1> Word: {word} </h1>
            }
             
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField id="standard-basic" label="Standard" variant="standard" type='text' onChange={handleInputChange}/> 

                <Button variant="contained" 
                onClick={() => {
                    if (begin) {
                        compare()
                        handleConfirmClick()
                    } else {
                        return null
                    }        
                }}>
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