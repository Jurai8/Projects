import '../App.css';
import React, { useState } from 'react';
import VocabBook from '../components/Table'
import AddWord from '../components/Modal';
import { Button } from '@mui/material';


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

    return (
        <div id='table-position'>
            {/* create a shadow around the box*/}
            <div className='button-container'>
                <Button variant="contained" onClick={openModal}>New Word</Button>
            </div>
            <VocabBook />
            {isModalOpen && <AddWord onClose={closeModal} />}
        </div>
    )
}