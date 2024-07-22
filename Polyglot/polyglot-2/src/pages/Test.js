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
    const [count, setCount] = useState(0);
    const vocabListRef = useRef([]);

    // this needs to happen before the mount
    useEffect(() => {
        setWord(vocabListRef.current[count])
    }, [count])

    const initializeVocab = async () => {
        const newWords = await FetchVocab();
        vocabListRef.current = newWords;
        console.log(vocabListRef.current);
        setCount(0); // Reset count to 0 to start from the first word
      };

      // checkAnswer

    return (
        <div>
            <h1> Word: {word}</h1>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField id="standard-basic" label="Standard" variant="standard" type='text'/> {/*inputRef={answer} */ }
                <Button variant="contained" 
                onClick={() => setCount((prevCount) => prevCount + 1)}>
                    Confirm
                </Button>

                <Button variant="contained" onClick={initializeVocab}>
                    Begin
                </Button>
            </Box>
        </div>
    )
}