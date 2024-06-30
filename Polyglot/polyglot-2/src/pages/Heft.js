import '../App.css';
import * as React from 'react';
import VocabBook from '../components/Table'
import { Button } from '@mui/material';


// button leading to current page should be removed
export default function Heft () {
    // <AddWord> will pop up as a modal when the user wants to enter a word
    return (
        <div id='table-position'>
            {/* create a shadow around the box*/}
            <div className='button-container'>
                <Button variant="contained">New Word</Button>
            </div>
            <VocabBook />
        </div>
    )
}