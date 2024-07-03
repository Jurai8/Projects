import '../App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { createData } from './Table'

export default function AddWord ({ onClose }) {
    const [input, setInput] = useState({
        native: '',
        translation: ''
    })

    const newNative = (e) => {
        setInput(prevInput => ({
            ...prevInput,
            native: e.target.value
        }));
    };

    const newTranslation = (e) => {
        setInput(prevInput => ({
            ...prevInput,
            translation: e.target.value
        }));
    };
    return (
        <div className='overlay'>
            <Box 
                className='new-word-modal'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                 {/* set the value with onChange */}
                <TextField id="outlined-basic-english" label="English" name="native" variant="outlined"
                 onChange={ newNative } 
                />
                <TextField id="outlined-basic-german" label="German" name="translation" variant="outlined"
                onChange={ newTranslation }
                 />
    
                <div id='confirm-word'>
                    {/*don't use createData function. use as component

                    CreateData is a constructor not a component do it another way
                        <CreateData
                            wordset={{ word: input.native , translation: input.translation}}
                        /> 
                        CreateData(input)
                        Can i do this without a return statement?
                    */}
                    <Button variant="contained" onClick={() => { 
                        onClose(); createData(input.native, input.translation); 
                        }}>
                        Confirm
                    </Button>
                </div>
            </Box>
        </div>
    )
}

export function Register () {
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
            <div >
                <TextField
                id='outlined-basic-username'
                placeholder="carlos@gmail.com"
                label="Email"
                variant="outlined"
                />
            </div>
            <div >
                <TextField
                id='outlined-basic-username'
                label="Username"
                variant="outlined"
                />
            </div>
            <div>
                <TextField
                id='outlined-basic-password'
                label="Password"
                variant="outlined"
                />
            </div>
            <Button id="Confirm-word" variant="contained" >
                Sign up
            </Button>
        </Box>
    )
}