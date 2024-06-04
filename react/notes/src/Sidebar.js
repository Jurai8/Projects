import React, { useState } from 'react';

// take toggleNabar as an arg
export function OpenNavbar ({ toggleNavbar }) {
  return (
    <div className="navbar">
      <div className='navbar_link'>

        {/* sidebar = display flex */}
        <div onClick={toggleNavbar} className='sidebar-items'>
          {/* when list is clicked, call toggleNavbar */}
          <span className="material-icons">
              list
          </span> Menu
        </div>

        <div onClick={toggleNavbar} className='sidebar-items'>
          <span className="material-icons">
              add_circle
          </span> New note
        </div>

        <div onClick={toggleNavbar} className='sidebar-items'>
          <span className="material-icons">
              save
          </span> Save note
        </div>

        <div onClick={toggleNavbar} className='sidebar-items'>
          <span className="material-icons">
              share
          </span> Share
        </div>

        <div onClick={toggleNavbar} className='sidebar-items'>
          <span className="material-icons">
              person
          </span> Account
        </div>

      </div>
    </div>
  );
}


export function ClosedNavbar({ toggleNavbar }) {
  return (
    <div className="navbar navbar-closed">
      <div onClick={toggleNavbar} className='navbar_link closed'>
        <span className="material-icons">
              menu_open
        </span>
      </div>
    </div>
);
}

export function Navbar() {

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

// named component = the open version of navbar
// default  component = closed version
// when a button within the defualt component is clicked
    // return the named component

// css handles transtion time etc




