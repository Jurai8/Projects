import '../App.css';
import React, { useState } from 'react';
import VocabBook from '../components/Table'
import AddWord from '../components/Modal';
import { Button } from '@mui/material';

/*Idea: 
    pass the buttons as a prop to the modal component
    maybe just pass all the important stuff as props */


// button leading to current page should be removed
export default function Heft () {
    // <AddWord> will pop up as a modal when the user wants to enter a word
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Updating input to add it into vocabBook
    const [input, setInput] = useState({
        native: '',
        translation: ''
    })

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

    /* create eventhandler, use e as arg
        if name of input = native
            update native 

    */


    return (
        <div id='table-position'>
            <div className='button-container'>
                <Button variant="contained" onClick={openModal}>
                    New Word
                </Button>
            </div>
            <VocabBook input={ input }/>
            {/*when the modal closes pass, input to vocab book */}
            {isModalOpen && <AddWord onClose={() => {
                closeModal();
                newTranslation(e);
                newNative(e);
                // pass eventhandler as a prop instead of the transltoin and native
            }}/>
            }
        </div>
    )
}