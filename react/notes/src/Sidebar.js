import React, { useState } from 'react';

// take toggleNabar as an arg
export function OpenNavbar ({ toggleNavbar }) {
  return (
    <div className='overlay'>
      <div className="navbar ">
        <div className='navbar_link'>

          {/* sidebar = display flex */}
          <div onClick={toggleNavbar} className='sidebar-items'>
            {/* when list is clicked, call toggleNavbar */}
            <span className="material-icons">
                list
            </span> Menu
          </div>

          <div className='sidebar-items'>
            <span className="material-icons">
                add_circle
            </span> New note
          </div>

          <div className='sidebar-items'>
            <span className="material-icons">
                save
            </span> Save note
          </div>

          <div className='sidebar-items'>
            <span className="material-icons">
                share
            </span> Share
          </div>

          <div className='sidebar-items'>
            <span className="material-icons">
                person
            </span> Account
          </div>
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
  <div>
    <OpenNavbar toggleNavbar={toggleNavbar}/> 
  </div>
  // else close the navbar
  : <div>
      <ClosedNavbar toggleNavbar={toggleNavbar} />;
    </div>
}


// a prop is basically a variable?
// i'm defining a variable called textAreaSize and setting it's value to the function textAreaSize
// the other components can then reference the variable to call the function.


