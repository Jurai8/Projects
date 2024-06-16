import React, { useState } from 'react';

// when user types add it in between the h1 tag
export function Cursor () {
    return (
        // create giant text area and figure out how to change it with css
        // then how to change it's state? e.g when user wants bullet points
        <div className="textarea-container">
            <textarea id="typing-area" name="typing-area"></textarea>
        </div> 
    )
}



/* in a word document if you click at the bottom of the page the cursor won't go there 
   it only follows the words. conversly you could just press enter and then the 
   div would grow. enter = ''
   
   idea.
   if the user types a letter on keyboard what they type gets added to element <p>
   
   or what they type is returned by js?*/