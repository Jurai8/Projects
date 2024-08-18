import '../App.css';
import React, { useState, useEffect} from 'react';
import VocabBook from '../components/Table'
import AddWord from '../components/Modal';
import Sidebar from '../components/Sidebar';
import { NewCollection } from '../components/Modal';
import { Button } from '@mui/material';
import { firestore } from '../firebase';
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DisplayVocabList } from '../components/MyEventHandlers';
import { Vocab } from '../components/Learner';

/* TODO: 
    if user has no vocab list
        display modal 
        values: Name of list, first word pair
        create new vocab list
        add vocab list name to "All_Vocab_List" collection
*/


// button leading to current page should be removed
export default function Heft () {

    const [newVocabCollection, setNewVocabCollection] = useState(false);

    const toggleNewCollectionModal = (bool) => {
        setNewVocabCollection(bool);
    }
    // state for sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = (newOpen) => () => {
        setIsSidebarOpen(newOpen);
    };
    
    // Updating input to add it into vocabBook
    const [input, setInput] = useState({
        native: '',
        translation: ''
    })

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

    // manage state of which vocab book to show
    // pass vocab to vocabBook
    const [vocab, setVocab] = useState([]);
    // name of vocablist that is being accessed by user
    const [currList, setCurrList] = useState("");

    // <AddWord> will pop up as a modal when the user wants to enter a word
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        // clear current input
        setInput('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    // Create a drop down menu within modal for new word
        // the user can pick what type of word it is, e.g adjective, noun
        /* save to db {
            status:
            word_type:
            word:
            translation: 
        }*/


    // pass this to confirm button
    const updateVocab = () => {
        // if the input is not a string
        if (!input || typeof input.native !== 'string' || typeof input.translation !== 'string') {
            alert('Both fields must be filled out.');
            return;
        }
    
        // If the input strings are empty or only contain whitespace
        if (input.native.trim() === '' || input.translation.trim() === '') {
            alert('Both fields must be filled out.');
            return;
        }

        const auth = getAuth();
        
        // get signed in user
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const words = new Vocab(user)

                try {
                    // name of vocab list + the new word
                    await words.addWord(currList, input);

                    console.log("Word has been added to list");
                    alert("Word has been added to list");

                } catch (error) {
                    console.error("Error caught while adding word to vocablist", error);
                }
            } else {
                console.log("user not logged in")
            }
        });
        
    }

   

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

    // TODO: replace this with some method from learner.js
    // function to set state using vocab list name
    const getListName = async (ListName) => {
        // row = displayvocablist()
        try {
            const vocabList = await DisplayVocabList(ListName);
            // set all the vocab within the specific list
            setVocab(vocabList);
            // set name of current vocab list
            setCurrList(ListName);
        } catch (error) {
            console.error("unable to display vocab list")
        }
        
    }

    // lol what's the diff between uodate and edit
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
                {/* only display button when showing a list */}
                {currList !== "" &&
                 <Button variant="contained" onClick={() => {
                    openModal();
                    whichModal(true);
                }}>
                    New Word
                </Button>
                }
                <Button variant="contained" onClick={toggleSidebar(true)}>          
                    Collections 
                </Button>
            </div>

            
            {isSidebarOpen &&
             <Sidebar toggleSidebar={toggleSidebar} 
             isSidebarOpen={isSidebarOpen} getListName={getListName}
             toggleNewCollectionModal={toggleNewCollectionModal}
            />}

            {newVocabCollection && 
                <NewCollection 
                    toggleNewCollectionModal={toggleNewCollectionModal}
                />
            }

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
                    // can i pass these two functions in one variable?
                    openModal={openModal} 
                    whichModal={whichModal}
                />
            }
        </div>
    )
}