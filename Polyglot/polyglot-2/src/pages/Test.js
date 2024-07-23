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


    const [word, setWord] = useState('');
    const [count, setCount] = useState(null);
    const [input, setInput] = useState('');
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const vocabListRef = useRef([]);
   

    useEffect(() => {
        // not wokrking
        if (vocabListRef.current[count + 1] === null) {
            setScore(calculateResults())
            console.log("hello")
        } else {
            setWord(vocabListRef.current[count])
        }

    }, [count, answers])

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
        setAnswers((prevAnswers) => [...prevAnswers, input]);
        setInput(''); // Clear the input field after adding to the array
        setCount((prevCount) => prevCount + 1);
    };

   const calculateResults = () => {
        let score = 0;
        for (let i = 0; i < vocabListRef.length - 1; i++) {
            if (vocabListRef[i] === answers[i]) {
                score++;
            }
        }
        return score;
    }

    return (
        <div>
            {score === 0 ?  <h1> Word: {word}</h1> : 
               <h1> Word: {score}</h1> }
           
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
                onClick={handleConfirmClick}>
                    Confirm
                </Button>

                <Button variant="contained" onClick={() => {
                     initializeVocab()  
                }}>
                    Begin
                </Button>
            </Box>
        </div>
    )
}