import React, { useState } from 'react'; 


// when user types add it in between the h1 tag
export function TextArea ({ position }) { 
    return (
        // contenteditable = allow people to type in it
        <div className="textarea-container" style={{ textAlign: position }} contenteditable="true">
            jhbhjhb
        </div> 
    )
}
