import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';

// This is the vocab test

// compare the word that they write against the word that they have saved
// if they are the same  +1 point else -1 point
// at the end give them their score/percentage 
// show words that they got incorrect

// first hardcode
let vocabList = [];

export default function Test() {
    const answer = useRef(null);
    const [testWord, setTestWord] = useState(null);
    let counter = useRef(0);

    const nextWord = () => {
        if (counter.current < vocabList.length - 1) {
            counter.current++;
            setTestWord(vocabList[counter.current].translation);
        } else {
            alert("No more words");
        }
    }

    const word = async () => {
        try {
            const vocab = await getDocs(collection(firestore, "Vocabulary"));

            // Using map to transform each document's data and return an array of results
            vocabList.push(...vocab.docs.map(doc => doc.data()));
            setTestWord(vocabList[0].translation); 
            alert("begin");
        } catch (error) {
            console.log('Error fetching words from db:', error);
            throw error; // Propagate the error for handling elsewhere
        }
    }; 

    return (
        <div>
            <h1>Word: {testWord}</h1>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField id="standard-basic" label="Standard" variant="standard" type='text' inputRef={answer} />
                {/*display block + justify content right */}
                <Button variant="contained" onClick={() => {
                    if (answer.current.value === word) {
                        nextWord();
                        return alert("correct");
                    } else {
                        nextWord();
                        return alert("incorrect");
                    }
                }}>
                    Confirm
                </Button>

                <Button variant="contained" onClick={ async () => {
                    await word();
                }}>
                    Begin
                </Button>
            </Box>
        </div>
    )
}