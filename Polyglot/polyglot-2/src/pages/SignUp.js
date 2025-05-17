import CssBaseline from '@mui/material/CssBaseline';
import { LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import { Box, TextField, Button, Link} from '@mui/material';




// TODO if logged in user doesn't have a library ask them to create their first library

// TODO: implement sign in with google

export default function SignUp() {
  
  const { register, loading, error } = useAuth();

  return (
    <div>
        <CssBaseline />
        {/* conditional rendering for register and sign in */}
        {loading ? 
          <h2> loading...</h2> :

          <RegisterModal register={register} />
          
        }
          
        {error ?
        // if there is an error
        <p style={{ color: 'red' }}>{error.message}</p> 
        // else success
        : <p style={{ color: 'green' }}>{error.message}</p>
        }
    </div>
  )
}


export function SignIn() {

  // use one state handler. set true/false
  const [error, setError] = useState(false);

  // ! no use in using a welcome message if i redirect the user
  // message depends on error or success
  const [message, setMessage] = useState("");

  return (
    <>
      <CssBaseline />
      <LogIn 
        setError={setError}
        setMessage={setMessage}
      /> 
      
      { error? 
        // if there is an error
        <p style={{ color: 'red' }}>{message}</p> 
        // else success
        : <p style={{ color: 'green' }}>{message}</p>
      }
    </>
  )
  
}

function RegisterModal({ register }) {

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  const handleSubmit = async () => {
    await register(emailRef, passwordRef, usernameRef);
  }

  return (
    <Box
        component="form"
        method='post'
        action='/checkUser'
        sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
    >
        <h1>Sign Up</h1>
        <div >
            <TextField
            id='outlined-basic-email'
            placeholder="carlos@gmail.com"
            label="Email"
            variant="outlined"
            inputRef={emailRef}
            />
        </div>
        <div >
            <TextField
            id='outlined-basic-username'
            label="Username"
            variant="outlined"
            inputRef={usernameRef}
            />
        </div>
        <div>
            <TextField
            id='outlined-basic-password'
            label="Password"
            variant="outlined"
            type='password'
            inputRef={passwordRef}
            />
        </div>
        <Button id="Confirm-word" variant="contained" type='submit'>
            Sign up
        </Button>
        <section>
            <p>Already have an account?</p> 
            <Link to="/signin">
                sign in
            </Link>
        </section>
    </Box>
  )
}