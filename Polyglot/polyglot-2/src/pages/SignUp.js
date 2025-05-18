import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useRef, useState} from 'react';
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

        <>
          <RegisterModal register={register} />
        
          {error.status === true &&
            // if there is an error
            <p style={{ color: 'red' }}>{error.message}</p> 
          }
        </>
        
      }
          
    </div>
  )
}


export function SignIn() {

  const { login, error, loading } = useAuth();


  useEffect(() => {
    console.log(error.status)
  }, [error])

  return (
    <>
      <CssBaseline />
      {loading ? 
        <h2> loading...</h2> :

        <>
          <SignInModal login={login} />
        
          {error.status === true &&
            // if there is an error
            <p style={{ color: 'red' }}>{error.message}</p> 
          }
        </>
        
      }
    </>
  )
  
}

function RegisterModal({ register }) {

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await register(emailRef.current.value, passwordRef.current.value, usernameRef.current.value);
  }

  return (
    <Box
        component="form"
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
        <Button variant="contained" type='submit'>
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


function SignInModal ({ login }) {

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          await login(
            emailRef.current.value, 
            passwordRef.current.value 
          )        
      } catch (error) {
          console.error(error);
      }
    }


  return (
    <Box
      component="form"
      sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <h1>Log In</h1>
      <div >
          <TextField
          id='outlined-basic-email'
          placeholder="carlos@gmail.com"
          label="Email"
          variant="outlined"
          inputRef={emailRef}
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
      <Button variant="contained" type='submit'>
          Log in
      </Button>
      <section>
          <p>Don't have an account ?</p> 
          <Link to="/signup">
              sign up
          </Link>
      </section>
    </Box>
  )
}