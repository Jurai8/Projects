import CssBaseline from '@mui/material/CssBaseline';
import { Register, LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';



/* if logged in user doesn't have a library ask them 
    to create their first library
*/

export default function SignUp () {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [signIn, setSignIn] = useState(false);

  const toggleSignIn = () => {
    setSignIn(!signIn);
  }

  return (
      <div>
          <CssBaseline />
          {/* conditional rendering for register and sign in */}
          {signIn ? 
            <LogIn 
              toggleSignIn={toggleSignIn} 
              setError={setError}
              setSuccess={setSuccess}
            /> :
            <Register 
              toggleSignIn={toggleSignIn} 
              setError={setError}
              setSuccess={setSuccess}
            />
          }
  
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
  )
}