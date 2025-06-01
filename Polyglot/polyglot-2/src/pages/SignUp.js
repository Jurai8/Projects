import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import { Box, TextField, Button, Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';




// TODO if logged in user doesn't have a library ask them to create their first library

// TODO: implement sign in with google

export default function SignUp() {

  const { register, loading, error, user } = useAuth();

  if (user) return <h2> loading...</h2>;

  return (
    <div className='auth-modal-container'>
      <CssBaseline />
      {/* conditional rendering for register and sign in */}
      {(loading || user) ? (
        <Box className='loading-icon-position'>
          <CircularProgress className='' />
        </Box> 
      ) : (
        // TODO: fix the spacing between the modal and error message
        
        <div 
          style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // or set a fixed height if not full screen
          width: '100%',
        }}>
          <RegisterModal register={register} />

          {error.status === true &&
            // if there is an error
            <p style={{ color: 'red' }}>{error.message}</p> 
          }
        </div>
      )}
          
    </div>
  )
}


export function SignIn() {

  const { login, error, loading } = useAuth();


  useEffect(() => {
    console.log(error.status)
  }, [error])

  return (
    <div className='auth-modal-container'>
      <CssBaseline />
      {loading ? 
        <Box className='loading-icon-position'>
          <CircularProgress className='' />
        </Box> 
      :

      // TODO: fix the spacing between the modal and error message
        <div 
          style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // or set a fixed height if not full screen
          width: '100%',
        }}>
          <SignInModal login={login} />

          {error.status === true &&
            // if there is an error
            <p style={{ color: 'red' }}>{error.message}</p> 
          }
        </div>
        
      }
    </div>
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

  const navigate = useNavigate();

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',       // center horizontally
        justifyContent: 'center',   // center vertically (when height is set)
        height: '100%'
      }}
      
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Box 
        className='auth-modal'
        id='auth-modal-signUp'
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',       
          justifyContent: 'center',
          '& > :not(style)':  {m: 1, width: '25ch' } 
        }}
      >
        <h1 style={{ textAlign: 'center', width: '100%' }}>Sign Up</h1>
        
          <TextField
            id='outlined-basic-email'
            placeholder="carlos@gmail.com"
            label="Email"
            variant="outlined"
            inputRef={emailRef}
          />
      
          <TextField
            id='outlined-basic-username'
            label="Username"
            variant="outlined"
            inputRef={usernameRef}
          />

          <TextField
            id='outlined-basic-password'
            label="Password"
            variant="outlined"
            type='password'
            inputRef={passwordRef}
          />

        <Button variant="contained" type='submit'>
          Sign up
        </Button>
      
        <section>
          <p>Already have an account?</p>

          <p onClick={() => navigate("/signin")}> sign in </p> 
        </section>

      </Box>
        
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

  const navigate = useNavigate();


  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',       // center horizontally
        justifyContent: 'center',   // center vertically (when height is set)
        height: '100%'
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Box 
        className='auth-modal'
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',       
          justifyContent: 'center',
          '& > :not(style)':  {m: 1, width: '25ch' } 
        }}
      >
        <h1 style={{ textAlign: 'center', width: '100%' }}>Log In</h1>

        <TextField
          id='outlined-basic-email'
          placeholder="carlos@gmail.com"
          label="Email"
          variant="outlined"
          inputRef={emailRef}
        />
      
        <TextField
          id='outlined-basic-password'
          label="Password"
          variant="outlined"
          type='password'
          inputRef={passwordRef}
        />
    
        <Button variant="contained" type='submit'>
            Log in
        </Button>
        <section>
            <p>Don't have an account ?</p> 

            <p onClick={() => navigate("/signup")}> sign up </p> 
        </section>
      </Box>
      
    </Box>
  )
}