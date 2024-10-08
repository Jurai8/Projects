import CssBaseline from '@mui/material/CssBaseline';
import { Register, LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';



// TODO if logged in user doesn't have a library ask them to create their first library

// TODO: implement sign in with google

export default function SignUp() {
  // use one state handler. set true/false
  const [error, setError] = useState(null);
  // message depends on error or success
  const [message, setMessage] = useState(null);

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
              setMessage={setMessage}
            /> :
            <Register 
              toggleSignIn={toggleSignIn} 
              setError={setError}
              setMessage={setMessage}
            />
          }
          {error ?
          // if there is an error
          <p style={{ color: 'red' }}>{message}</p> 
          // else success
          : <p style={{ color: 'green' }}>{message}</p>
          }
      </div>
  )
}

export function SignIn() {
  // TODO: check Prerequisites
  <>
  <script src="https://accounts.google.com/gsi/client" async></script>
    <div id="g_id_onload"
        data-client_id="YOUR_GOOGLE_CLIENT_ID"
        data-login_uri="https://your.domain/your_login_endpoint"
        data-auto_prompt="false"> {/* //! remove */}
    </div>
    <div class="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left">
    </div>
  </>
    
}