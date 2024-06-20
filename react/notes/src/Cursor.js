import React, { useState } from 'react'; 

// when user types add it in between the h1 tag
export function TextArea () {
    return (
        // contenteditable = allow people to type in it
        <div className="textarea-container" contenteditable="true"></div> 
    )
}

// edit state of div
    // if user click button, display bullet points etc
