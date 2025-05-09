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
    const { list } = useParams();
    const { user } = useAuth();
    const { addWord } = useSetVocab(user);
    const [learner, setLearner] = useState(null);
    const checkInput = new InputCheck()

    useEffect(() => {
        const getUser = () => {
            if (user) {
                setLearner(user); // Set the learner when the user is authenticated
            } else {
                console.log("User is signed out");
                alert("Heft: user not signed in")
            }
        }

        getUser();
    }, [user]);

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

    // manage state of which vocab book to show
    // pass vocab to vocabBook
    const [vocab, setVocab] = useState([]);

    // name of vocablist that is being accessed by user
    const [currList, setCurrList] = useState("");

    // get vocabulary to pass to vocab 
    useEffect(() => {
        if (list && vocabulary) {
            const getListName = async () => {
                try {
                    const vocabList = await vocabulary.getVocabulary(list);

                    console.log("vocabList: ", vocabList);
                    // set all the vocab within the specific list
                    setVocab(vocabList);
                    // set name of current vocab list
                    setCurrList(list);
                } catch (error) {
                    console.error("unable to display vocab list", error);
                }
            }

            getListName();
        }
    },[list,vocabulary])

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

        try {
            try {
                checkInput.checkVocabInput(input)
            } catch (error) {
                alert(error);
                throw new Error("error with inputs: " + error);
            }
            // name of vocab list + the new word
            console.log("Heft, Currlist: " + typeof currList)

            if (addWord) {
                console.log("addword exists");
            } else if (!addWord) {
                console.log("addWord does not exist")
            }
            await addWord(currList, input);

            console.log("Word has been added to list");

            window.location.reload()
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

            window.location.reload()
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

            window.location.reload()
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

          // TODO: change
          return "nothing worked";
        });
    };


    // function to set state using vocab list name
    // ? is this even being used ?
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

    // control modal for viewing info of a word
    //? can this control when both vocab book and the modal reload, to show the updated data ?
    const [wordInfoModal, setWordInfoModal] = useState({show: null, word: null})

    // word = the chosen word whose info will be displayed
    // bool regulates whether the modal will open or no
    const displayInfo = (bool, word) => {
        if (bool === true) setWordInfoModal({
            show: true,
            word: word
        })
    
        if (bool === false) setWordInfoModal({
            show: false, 
            word: null
          });
      }
    
    return (
        <>
        <h1>{currList}</h1>
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

            {/* //TODO remove the sidebar? use the collections button to route baack to vocablists.js */}
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

            {/* modal displaying word info */}
            {
                wordInfoModal.show && 
                <WordInfoModal 
                    displayInfo={displayInfo} 
                    wordInfo={wordInfoModal} 
                />
            }

                <VocabBook 
                    vocab={vocab} 
                    getOriginalWord={getOriginalWord}
                    // triggers EditWord
                    openModal={openModal}
                    openDeleteVocab={openDeleteVocab}
                    displayInfo={displayInfo}
                />
        </div>
        </>
       
    );
}