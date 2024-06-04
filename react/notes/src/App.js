import React, { useState } from 'react';
import './App.css';
import { OpenNavbar, ClosedNavbar, Navbar} from './Sidebar.js';

function App() {
  return (
    // figure out how to allow people to write on the page
    // should a div cover the entire page, the said div=input tag?
    <div>
      <Navbar />
    </div>
  );
}


// create two components?
// sidebar closed and sidebar opened?


/*1. left vertical active bar
    - new note
    - account
    - save note
    

  3. top left corner - user icon
  4. the page to write on (color, default font)
  5. page to create an account
  6. backend database stuff for loging in etc... */

export default App;
