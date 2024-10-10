import CssBaseline from '@mui/material/CssBaseline';
import { Register, LogIn } from '../components/Modal';
import React, { useRef, useState} from 'react';
import { BrowserRouter as useLocation } from 'react-router-dom';



// TODO if logged in user doesn't have a library ask them to create their first library

// TODO: implement sign in with google

export default function SignUp() {
  // use one state handler. set true/false
  const [error, setError] = useState(null);
  // message depends on error or success
  const [message, setMessage] = useState(null);

  return (
      <div>
          <CssBaseline />
          {/* conditional rendering for register and sign in */}
            <Register 
              
              setError={setError}
              setMessage={setMessage}
            />
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
  let { state } = useLocation();

  // use one state handler. set true/false
  const [error, setError] = useState(false);
  // message depends on error or success
  const [message, setMessage] = useState("");

  return (
    <>
      <CssBaseline />
      <LogIn 
        setError={setError}
        setMessage={setMessage}
        userSignedIn={state}
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

/* 
* // ! can't do this yet. Need an authorized domain
* vist "https://developers.google.com/identity/gsi/web/guides/display-button#html", when ready

export function SignIn() {
  // TODO: check Prerequisites
  <>
  <script src="https://accounts.google.com/gsi/client" async></script>
    <div id="g_id_onload"
        data-client_id="YOUR_GOOGLE_CLIENT_ID"
        data-login_uri="https://your.domain/your_login_endpoint"
        data-auto_prompt="false"> 
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
*/