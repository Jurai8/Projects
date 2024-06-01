import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
    </div>
  );
}


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`navbar ${isOpen ? 'navbar--open' : ''}`} onClick={toggleNavbar}>
      {/* Navbar content */}
      <div className="navbar navbar-content">
        <button className='navbar_link' id="menu">
          <span onClick={toggleNavbar} class="material-icons">
            list
          </span>
          {/* when textflag is false show the text  */}
          {!isOpen && ''}
        </button>
      </div>
    </div>
  );
}

// create two components?
// sidebar closed and sidebar opened?


/*1. left vertical active bar
  2. top horizontal active bar
  3. top left corner - user icon
  4. the page to write on (color, default font)
  5. page to create an account
  6. backend database stuff for loging in etc... */

export default App;
