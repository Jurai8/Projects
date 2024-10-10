import '../App.css';
import React, { useState, useEffect, useMemo} from 'react';
import VocabBook from '../components/Table'
import AddWord, { EditWord } from '../components/Modal';
import Sidebar from '../components/Sidebar';
import { NewCollection } from '../components/Modal';
import { Button } from '@mui/material';
import { firestore } from '../firebase';
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DeleteWord } from '../components/Modal';
import { Vocab } from '../components/Learner';
import { useParams } from 'react-router-dom';

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


// TODO: remove all excess functions that check if the user is signed in,
// TODO: remove all excess Vocab obj creations
// TODO: check if the function still work

// ? button leading to heft page should be removed?
export default function Heft () {
    // * so that i don't have to define a new Vocab obj each time
    // * or check if the user is signed in

    const { listName }  = useParams();

    console.log(listName || "no list");

    const [learner, setLearner] = useState(null);

    const getUser = () => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLearner(user); // Set the learner when the user is authenticated
            } else {
                console.log("User is signed out");
                alert("not signed in yet");
            }
        });
    }

    useEffect(() => {
        console.log("is user signed in?")
        getUser();
    }, []);

    const vocabulary = useMemo(() => {
        if (learner) {
            return new Vocab(learner); // Create a new Vocab object when learner is available
          } else {
            console.log("User not authenticated, function: Sidebar");
            return null;
          }
    }, [learner])
          

    // ! move to vocablist.js
    const [newVocabCollection, setNewVocabCollection] = useState(false);
    // ! move to vocablist.js
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
    });

    // TODO: using the concept of closures put these functions all under one functions, like a pseudo obj
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

    const [newWord, setNewWord] = useState({
        wordType: "which word", 
        native: "", 
        translation: "", 
        case: 0, 
    })

    const [originalWord, setOriginalWord] = useState({
        native: "", 
        translation: ""
    });

    const getOriginalWord = (wordpair) => {
        setOriginalWord({
            native: wordpair.native,
            translation: wordpair.translation
        })
    }
    // ? stop here


    // manage state of which vocab book to show
    // pass vocab to vocabBook
    const [vocab, setVocab] = useState([]);

    // name of vocablist that is being accessed by user
    const [currList, setCurrList] = useState("");

    // get vocabulary to pass to vocab 
    useEffect(() => {
        if (listName) {
            console.log("hello: ", listName.list || "no params");
            const getListName = async () => {
                try {
                    // TODO: replace this with some method from learner.js
                    const vocabList = await vocabulary.getVocabulary(listName.list);

                    console.log("vocabList: ", vocabList);
                    // set all the vocab within the specific list
                    setVocab(vocabList);
                    // set name of current vocab list
                    setCurrList(vocabList);
                } catch (error) {
                    console.error("unable to display vocab list", error);
                }
            }

            getListName();
        }
    },[listName,vocabulary])

    // control both edit/add word modals 
    const [isModalOpen, setIsModalOpen] = useState({
        addWord: false, editWord: false
    });

    const openModal = (number) => {
        if (number !== 2 && number !== 1) {
            alert("Error");
            return;
        }
        
        if (number === 2) {
            setIsModalOpen({addWord: false, editWord: true});
        }

        if (number === 1) {
            setIsModalOpen({addWord: true, editWord: false});
        }
        // clear current input
        setInput('');
    };

    const closeModal = (number) => {
        if (number !== 2 && number !== 1) {
            alert("Error");
            return;
        }

        if (number === 2) {
            setIsModalOpen({addWord: false, editWord: false});
        }

        if (number === 1) {
            setIsModalOpen({addWord: false, editWord: false});
        }
    };
    
    const [deleteVocabModal, setDeleteVocabModal] = useState(false);

    const openDeleteVocab = () => setDeleteVocabModal(true);
        
    const closeDeleteVocab = () => setDeleteVocabModal(false);

    // pass this to confirm button
    const updateVocab = async () => {
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

        try {
            // name of vocab list + the new word
            await vocabulary.addWord(currList, input);

            console.log("Word has been added to list");
            alert("Word has been added to list");

        } catch (error) {
            console.error("Error caught while adding word to vocablist", error);
        }
       
    }

    const editVocab = async () => {
        // TODO: check input
        try {
            console.log("before calling editWord: ", newWord.native)
            // name of vocab list + the new word
            await vocabulary.editWord(currList, originalWord, newWord);

            alert("Successfully edited word");

        } catch (error) {
            console.error("Error caught while editing word", error);
        }
    }

    // * delete vocab 
    const deleteVocab = async () => {
        try {
            // name of vocab list + og word
            await vocabulary.deleteWord(currList, originalWord);

            alert("Successfully deleted word");

        } catch (error) {
            console.error("Error caught while deleting word", error);
        }
    } 


    const eventHandler = (e) => {

        if (e.target.name === "any-word") {
            // update existing word
            switch(newWord.case) { 
                // update native

                // issue with collecting input
                case 1:
                    console.log("case 1");
                    setNewWord(prevNewWord => ({ 
                        ...prevNewWord,   
                        native: e.target.value        
                    }));
                    
                    break;
                // update translation
                case 2:
                    setNewWord(prevNewWord => ({ 
                        ...prevNewWord,   
                        translation: e.target.value        
                    }));
                    break;
                // update both
                case 3:
                    if (e.target.id === "editNative") {
                        setNewWord(prevNewWord => ({ 
                            ...prevNewWord,   
                            native: e.target.value         
                        }));
                    } 
                    if (e.target.id === "editTrans") {
                        setNewWord(prevNewWord => ({ 
                            ...prevNewWord,   
                            translation: e.target.value         
                        }));
                    }
                    break;
                default:
            } 
            // make sure for case three, the following if statement for add word isn't executed (they use the same modal)
            return;
        }

        // add new word
        if (e.target.name === "native") {
            newNative(e);
            setNewWord({native: e})
        } 
        if (e.target.name === "translation") {
            newTranslation(e);
            setNewWord({translation: e})
        }
    }

    // modal for update word
    const closeUpdateWord = (event, value) => {
    
        setNewWord(() => {
          if (value === null || value === undefined) {
            return {
                wordType: "which word"
            };
          }
          
          // if they click outside the menu
          if (event.currentTarget.value === null || event.currentTarget.value === undefined) {
            return {
                wordType: "which word"
            };
          }

          if (value === "both") {
            return {
                wordType: value,
                case: 3
            }
          } else if (value === "translation") {
            return {
                wordType: value,
                case: 2
            }
          } else if (value === "native") {
            return {
                wordType: value,
                case: 1
            }
          }

          // change
          return "nothing worked";
        });
    };


    // function to set state using vocab list name
    const getListName = async (ListName) => {
        try {
            // TODO: replace this with some method from learner.js
            const vocabList = await vocabulary.getVocabulary(ListName);
            // set all the vocab within the specific list
            setVocab(vocabList);
            // set name of current vocab list
            setCurrList(ListName);
        } catch (error) {
            console.error("unable to display vocab list", error);
        }
    }
    
    return (
        <div id='table-position'>
            <div className='button-container'>
                {/* only display button when showing a list */}
                {currList !== "" &&
                 <Button variant="contained" onClick={() => {
                    openModal(1);
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

            {/* // !move to vocablist.js*/}
            {newVocabCollection && 
                <NewCollection 
                    toggleNewCollectionModal={toggleNewCollectionModal}
                />
            }

            {isModalOpen.addWord &&
                <AddWord 
                    closeModal={closeModal} 
                    eventHandler={eventHandler}
                    updateVocab={updateVocab}
                    newWord={newWord}
                /> 
            }

            {isModalOpen.editWord &&
                <EditWord 
                    eventHandler={eventHandler}
                    closeUpdateWord={closeUpdateWord}
                    closeModal={closeModal}
                    newWord={newWord}
                    editVocab={editVocab}

                />
            }

            {/*Modal for delete vocab */
                deleteVocabModal && 
                <DeleteWord 
                    deleteVocab={deleteVocab} 
                    closeDeleteVocab={closeDeleteVocab}
                    open={deleteVocabModal}
                />
            }

                <VocabBook 
                    vocab={vocab} 
                    getOriginalWord={getOriginalWord}
                    // triggers EditWord
                    openModal={openModal}
                    openDeleteVocab={openDeleteVocab}
                />
        </div>
    )
}