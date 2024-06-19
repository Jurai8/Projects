import React, { useState } from 'react';
import './App.css';
import { TextArea } from './Cursor.js';
import { Navbar } from './Sidebar.js';


function App() {
  return (
    <div className='parent-container'>
      <Navbar />
      <TextArea />
      {/* when navbar is toggled, texarea also needs to change
          However, i can't call textare within the navbar components
          it needs to be called within App.js so that it's displayed correctly
          .. maybe return a value to app.js. if that value changes then toggle textarea */}
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
