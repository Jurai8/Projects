import { Button,  } from '@mui/material';
import '../App.css';
import { DeleteWord, NewCollection, WordInfoModal } from '../components/Modal';
import { Vocab } from '../functions/vocab';
import { InputCheck } from '../functions/input';
import Sidebar from '../components/Sidebar';
import VocabBook from '../components/Table'
import React, { useState, useEffect, useMemo} from 'react';
import AddWord, { EditWord } from '../components/Modal';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSetVocab } from '../hooks/useVocab';

/* // TODO: 
    if user has no vocab list
        display modal 
        values: Name of list, first word pair
        create new vocab list
        add vocab list name to "All_Vocab_List" collection
*/

// ! this page will only display the vocab with in a heft
// ! to get to this page user needs to go to Vocablists.js, click on the list to view, then it will direct them here
// ! while in heft allow the user to switch between collections

// ! check which functions need to be moved


export default function Heft () {
    // get list name
 

    return (
        <>
        <h1>{currList}</h1>
        <div id='table-position'>
            <div className='button-container'>
                {/* "New Word" button which opens a modal*/}

                {/* Button to navigate back to collections view */}
                
            </div>

            {/* Add Word modal*/}


            {/* Edit Word modal */}
    

            {/*Modal for delete vocab */}

            {/* modal displaying word info */}
            

            {/* table displaying words from the collection */}
                
        </div>
        </>
       
    );
}