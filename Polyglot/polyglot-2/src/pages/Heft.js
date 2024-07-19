import '../App.css';
import React, { useState } from 'react';
import VocabBook from '../components/Table'
import AddWord from '../components/Modal';
import { Button } from '@mui/material';

import { firestore } from '../firebase';
import { addDoc, doc, setDoc, collection } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged} from "firebase/auth";

/*!!!!!! 
    How to create a vocabulary collection under each user? 
    
    user collection
        if (signed in uid === user A doc id)
            allow access to user A doc
        user A doc
            vocab book (subcollection)
        user B doc
        ...
*/


// button leading to current page should be removed
export default function Heft () {
    const ref = collection(firestore, "Vocabulary");

    // pass this to confirm button
    const dbUpdate = async () => {
        try {
            // update db
            const wordPair = await updateRows();
            addDoc(ref, {word: wordPair.word, 
                translation: wordPair.translation})

        } catch (error) {
            alert("empty input");
            console.error('Error caught:', error.message);
        }
    }

    const newCollection = async () => {
        // get signed in user
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const collectionRef = collection(firestore, "Users");
            const data = {
            author_uid: user.uid, // This must match the authenticated user's UID
            title: "Charles",
            content: "The goat"
            };

            try {
            const docRef = await addDoc(collectionRef, data);
            console.log('Document created successfully with ID:', docRef.id);
            } catch (error) {
            console.error('Error creating document:', error);
            }
        } else {
            console.log('No user is signed in');
        }
    }

    // <AddWord> will pop up as a modal when the user wants to enter a word
    const [isModalOpen, setIsModalOpen] = useState(false);

    // update row of words added into vocab book
    const [rows, setRows] = useState([]);

    // Updating input to add it into vocabBook
    const [input, setInput] = useState({
        native: '',
        translation: ''
    })

    const validateInput = () => {
        return input.native !== '' && input.translation !== '';
      };

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

        return new Promise((resolve, reject) => {
            // if current row is empty...
            if (newRow.word === '' || newRow.translation === '' || ! validateInput()) {
                reject(new Error("Validation error: input fields cannot be empty"));
            }else {
                setRows([...rows, newRow]);
                resolve(newRow);
            }
        })
       
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
            <div className='button-container'>
                <Button variant="contained" onClick={newCollection}>                
                    New collection
                </Button>
            </div>
            {/*when the modal closes pass, input to vocab book */}
            {isModalOpen ? (
                <AddWord 
                    onClose={closeModal} 
                    eventHandler={eventHandler}
                    // allow addword to update state of rows
                    dbUpdate={dbUpdate}
                /> 
            ) : <VocabBook rows={rows}/>
            }
        </div>
    )
}