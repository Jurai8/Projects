import '../App.css';
import React, { useState, useEffect} from 'react';
import VocabBook from '../components/Table'
import AddWord from '../components/Modal';
import Sidebar from '../components/Sidebar';
import { Button } from '@mui/material';
import { firestore } from '../firebase';
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DisplayVocabList } from '../components/MyEventHandlers';


// button leading to current page should be removed
export default function Heft () {

    // state for sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = (newOpen) => () => {
        setIsSidebarOpen(newOpen);
    };

    // state for update vocab 
        // render both text fields if the user wants to change both words
        // render one text field if user only wants to edit one word

    // Create a drop down menu within modal for new word
        // the user can pick what type of word it is, e.g adjective, noun
        /* save to db {
            status:
            word_type:
            word:
            translation: 
        }*/


    // TODO: Move updateVocab to MyEventHandler.js
    // pass this to confirm button
    const updateVocab = () => {
        const auth = getAuth();

        // get signed in user
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;

                try {
                    const vocabListRef = collection(firestore,"Users", userId, "Vocablist 1")
                    
                    // update vocablist
                    try {
                        const wordPair = await updateRows();
                        try {
                            await addDoc(vocabListRef, {
                                word: wordPair.word,
                                translation: wordPair.translation
                            });
                
                            console.log("Vocab list has been updated");
                        } catch (error) {
                            console.error('Error caught while adding document:', error.message);
                            alert("Error adding word to subcollection");
                        }
                    } catch (error) {
                        console.error('Error caught while updating rows:', error.message);
                        alert("Error updating rows");
                    }

                } catch (error) {
                    console.error('Error referencing subcollection:', error.message);
                    alert("Error referencing subcollection");
                }
            } else {
                console.log("user not logged in")
            }
        });
        
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

        if (e.target.name === "any-word") {
            // state handler to update input
        }
    }

    // update rows in VocabBook
    const updateRows = () => {
        const newRow = { word: input.native, translation: input.translation };  

        return new Promise((resolve, reject) => {
            // if current row is empty...
            if (newRow.word.trim() === '' || newRow.translation.trim() === '' || ! validateInput()) {
                reject(new Error("Validation error: input fields cannot be empty"));
            }else {
                setRows([...rows, newRow]);
                resolve(newRow);
            }
        })
    };

    // manage state of which vocab book to show
    // pass vocab to vocabBook
    const [vocab, setVocab] = useState([])

    // function to set state using vocab list name
    const getListName = async (string) => {
        // row = displayvocablist()
        try {
            const vocabList = await DisplayVocabList(string);
            setVocab(vocabList);
        } catch (error) {
            console.error("unable to display vocab list")
        }
        
    }

    const [updateOrEdit, setUpdateOrEdit] = useState(null);

    const whichModal = (Boolean) => {
        setUpdateOrEdit(Boolean)
    }
    
    /* 1. add function to delete/edit words
    
    /* button: new collection
        make user type in collection name and also add their first word */
    return (
        <div id='table-position'>
            <div className='button-container'>
                <Button variant="contained" onClick={() => {
                    openModal();
                    whichModal(true);
                }}>
                    New Word
                </Button>
                <Button variant="contained" onClick={toggleSidebar(true)}>          
                    Collections 
                </Button>
            </div>

            
            {isSidebarOpen &&
             <Sidebar toggleSidebar={toggleSidebar} 
             isSidebarOpen={isSidebarOpen} getListName={getListName}
            />}

            {/*when the modal closes pass, input to vocab book */}
            {isModalOpen ? (
                <AddWord 
                    onClose={closeModal} 
                    eventHandler={eventHandler}
                    updateOrEdit={updateOrEdit}
                    // allow addword to update state of rows
                    updateVocab={updateVocab}
                /> 
            ) : <VocabBook 
                    vocab={vocab} 
                    // why am i passing rows when they come from the db
                    rows={rows}
                    // can i pass these two functions in one variable?
                    openModal={openModal} 
                    whichModal={whichModal}
                />
            }
        </div>
    )
}