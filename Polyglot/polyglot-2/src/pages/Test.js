import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';

// This is the vocab test

// compare the word that they write against the word that they have saved
// if they are the same  +1 point else -1 point
// at the end give them their score/percentage 
// show words that they got incorrect

// first hardcode

export default function Test() {
    const word = "Heft";
    // useRef isn't working test it again
    const userInput = useRef('');

    return (
        <div>
            <h1>Word: {word}</h1>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField id="standard-basic" label="Standard" variant="standard" inputRef={userInput} />
                {/*display block + justify content right */}
                <Button variant="contained" onClick={() => {
                    if (userInput === word) {
                        return alert("incorrect");
                    } else {
                        return alert("correct")
                    }
                }}>
                    Contained
                </Button>
            </Box>
        </div>
    )
}