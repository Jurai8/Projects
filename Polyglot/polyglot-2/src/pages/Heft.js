import '../App.css';
import React, { useState } from 'react';
import VocabBook from '../components/Table'
import AddWord from '../components/Modal';
import { Button } from '@mui/material';

// button leading to current page should be removed
export default function Heft () {
    // <AddWord> will pop up as a modal when the user wants to enter a word
    const [isModalOpen, setIsModalOpen] = useState(false);

    // update row of words added into vocab book
    const [rows, setRows] = useState([]);

    // Updating input to add it into vocabBook
    const [input, setInput] = useState({
        native: '',
        translation: ''
    })

    // Modal
    const openModal = () => {
        setIsModalOpen(true);
        // clear current input
        setInput('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // input newWord
    const newNative = (e) => {
        setInput(prevInput => ({
            ...prevInput,
            native: e.target.value
        }));
    };

    const newTranslation = (e) => {
        setInput(prevInput => ({
            ...prevInput,
            translation: e.target.value
        }));

    };

    const eventHandler = (e) => {
        if (e.target.name === "native") {
            newNative(e);
        } 
        if (e.target.name === "translation") {
            newTranslation(e);
        }
    }

    // update rows in VocabBook
    const updateRows = () => {
        const newRow = { word: input.native, translation: input.translation };  
        // if current row is empty...
        if (newRow.word === '' || newRow.translation === '' || !setInput()) {
            return false;
        }else {
            setRows([...rows, newRow]);
            return true;
        }
    };
    
    /* 1. add function to delete/edit words
        2. if I confirm on the empty modal it update's with the same word, how do i stop this. 
            Solution: don't let words with the same key be added?*/
    return (
        <div id='table-position'>
            <div className='button-container'>
                <Button variant="contained" onClick={openModal}>
                    New Word
                </Button>
            </div>
            {/*when the modal closes pass, input to vocab book */}
            {isModalOpen ? (
                <AddWord 
                    onClose={closeModal} 
                    eventHandler={eventHandler}
                    // allow addword to update state of rows
                    updateRows={updateRows}
                /> 
            ) : <VocabBook rows={rows}/>
            }
        </div>
    )
}