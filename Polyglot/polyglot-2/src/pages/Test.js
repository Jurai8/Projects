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
            setTestWord(vocabList[counter.current].word);
        } else {
            alert("No more words");
        }
    }

    /* this function needs to be passed to heft
    create a button to begin the test*/
    const word = async () => {
        try {
            const vocab = await getDocs(collection(firestore, "Vocabulary"));

            // Using map to transform each document's data and return an array of results
            vocabList.push(...vocab.docs.map(doc => doc.data()));
            setTestWord(vocabList[0].word); 
            alert("begin");
        } catch (error) {
            console.log('Error fetching words from db:', error);
            throw error; // Propagate the error for handling elsewhere
        }
    }; 

    const compare = async (answer) => {
        // Simulate a fetch call
        return new Promise((resolve, reject) => {
            // user needs to write the translation
            if (answer === vocabList[counter.current].translation) {
                resolve("correct answer");
            } else {
                reject(new Error('Incorrect answer'));
            }
        }

    )};

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
                <Button variant="contained" onClick={async () => {
                    try {
                      let result = await compare(answer.current.value);
                       nextWord();
                       alert(result);
                    } catch (error) {
                        nextWord();
                        alert(error.message);
                    }
                }}>
                    Confirm
                </Button>

                <Button variant="contained" onClick={async () => {
                    await word();
                }}>
                    Begin
                </Button>
            </Box>
        </div>
    )
}