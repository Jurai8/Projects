import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export default function AddWord () {
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
            <TextField id="outlined-basic-english" label="English" variant="outlined" />
            <TextField id="outlined-basic-german" label="German" variant="outlined" />
            <Button id="Confirm-word" variant="contained" style={{ display: 'block' }}>
                Confirm
            </Button>
        </Box>
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