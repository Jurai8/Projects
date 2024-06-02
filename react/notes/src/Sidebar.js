import React, { useState } from 'react';

export default function Navbar() {

  // set 'isOpen to false
  const [isOpen, setIsOpen] = useState(false);

  // when this function is called 
  const toggleNavbar = () => {
    // "setIsOpen", will update "isOpen" to the opposite value
      setIsOpen(!isOpen);
  };

  // if "isOpen" =  true
  return isOpen ? 
  // open the navbar
  <OpenNavbar toggleNavbar={toggleNavbar} /> 
  // else close the navbar
  : <ClosedNavbar toggleNavbar={toggleNavbar} />;
}

// take toggleNabar as an arg
export function OpenNavbar ({ toggleNavbar }) {
  return (
    <div className="navbar">
      {/* when list is clicked, call toggleNavbar */}
        <span onClick={toggleNavbar} className="material-icons">
            list
        </span>
    </div>
  );
}


export function ClosedNavbar({ toggleNavbar }) {
  return (
    <div className="navbar navbar-closed">
        <span onClick={toggleNavbar} className="material-icons">
            menu_open
        </span>
    </div>
);
}


// named component = the open version of navbar
// default  component = closed version
// when a button within the defualt component is clicked
    // return the named component

// css handles transtion time etc


/*
<div className={`navbar ${isOpen ? 'navbar--open' : ''}`} onClick={toggleNavbar}>
    **Navbar content 
  <div className="navbar navbar-content">
    <button className='navbar_link' id="menu">
      <span onClick={toggleNavbar} class="material-icons">
        list
      </span>
        **when textflag is false show the text  
      {!isOpen && ''}
    </button>
  </div> 
</div>
*/

