import React, { useState } from 'react'; 
import { TopNavbar } from './Sidebar.js';

// when user types add it in between the h1 tag
export function TextArea () {
    return (
        // contenteditable = allow people to type in it
        <div className="textarea-container" contenteditable="true">jhbhjhb</div> 
    )
}

// edit state of div
    // if user click button, display bullet points etc
export function Position ({ setPosition }) {
    const handleSetPosition = (newPosition) => {
        setPosition(newPosition);
    };

    // when setPosition = "center"
    // change alignment to center

    return null; // don't render anything
    
}
