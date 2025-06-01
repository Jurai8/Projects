
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import { WordInfoModal } from '../components/Modal';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useFetchVocab, { useSetVocab } from '../hooks/useVocab';

import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


/* // TODO: 
    if user has no vocab list
        display modal 
        values: Name of list, first word pair
        create new vocab list
        add vocab list name to "All_Vocab_List" collection
*/

//? define the modals outside of heft



export default function Heft () {

    const { user } = useAuth();

    const { getVocab } = useFetchVocab(user);

    const { addWord } = useSetVocab(user)

    // this contains the name of the list
    const { state } = useLocation();

    const navigate = useNavigate();

    // vocab in the vocab table
    const [vocab, setVocab] = useState([]);

    const [listName, setListName] = useState();

    const [addWordModal, setAddWordModal] = useState(false);

    const closeAddWord = () => setAddWordModal(false);

    // control the wordInfo modal and pass the word whose data will be shown
    const [wordInfoModal, setWordInfoModal] = useState(false);
    const [wordInfo, setWordInfo] = useState({});

    const openWordInfo = (word) => {
        setWordInfo(word);
        setWordInfoModal(true);
    }

    const closeWordInfo = () => setWordInfoModal(false);

    useEffect(() => {
        setListName(state.listName)

        const getVocabulary = async () => {
            const words = await getVocab(state.listName);

            console.log(words);

            setVocab(words);
        }

        getVocabulary();

    },[getVocab, state.listName])

    return (
        <>
            {/* Add Word modal*/}
            <AddWordModal open={addWordModal} close={closeAddWord} addWord={addWord} listName={listName}/>

            {/* modal displaying word info */}
            <WordInfoModal 
                close={closeWordInfo} open={wordInfoModal} 
                word={wordInfo} 
            />

            {/*Modal for delete vocab */}

            <h1>{listName}</h1>
            <Box className='table-position'
            
            >
                <div className='button-container' >
                    {/* "New Word" button which opens addwordmodal*/}
                    <Button onClick={() => setAddWordModal(true)}>
                        New Word
                    </Button>

                    {/* Button to navigate back to collections view */}
                    <Button onClick={() => navigate("/vocablists")}>
                        Collections
                    </Button>
                </div>

                {/* table displaying words from the collection */}
                <TableContainer id='table-container' component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table"
                    className="template-table">
                        <TableHead>
                            <TableRow>
                                {/* replace with variables in future */}
                                <TableCell>English</TableCell>
                                <TableCell align="right" colSpan={2}>German</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { vocab ? (
                                vocab.map((row) => (
                                    <TableRow
                                        key={row.word}
                                        className='template-table-row'
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell 
                                            component="th" 
                                            id="vocab-source" 
                                            scope="row" 
                                        >
                                            {row.word}
                                        </TableCell>
                                        
                                        <TableCell 
                                            align="right" 
                                            id='vocab-translation' 
                                            sx={{ paddingRight: "0px !important" }}
                                        >
                                            {row.translation}
                                        </TableCell>    
        
        
                                        {/* change the sizing of the margin/padding etc */}
                                        <TableCell align="right" id='more-icon-heft' >
                                            {/* display info */}
                                            <IconButton onClick={() =>
                                                openWordInfo(row)
                                            }>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
        
                                    </TableRow>
                                )) ):(

                                <Box className='loading-icon-position'>
                                    <CircularProgress />
                                </Box>

                            )}
                            
                        </TableBody>
                    </Table>
                </TableContainer>   
            </Box>
        </>
       
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function AddWordModal({ open, close, addWord, listName }) {

    const [source, setSource] = useState("");
    // translation
    const [trans, setTrans] = useState("");

    

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='close-icon-container'>
                    <IconButton onClick={() => close()}>
                        <CloseIcon />
                    </IconButton>
                </div>


                <Typography id="modal-modal-title" variant="h6" component="h2">
                    New Word
                </Typography>
                                                  
                <TextField 
                    id="outlined-basic-english" label="Source" name="source" variant="outlined" onChange={(e) =>  
                        setSource(e.target.value)
                    } 
                /> 

                <TextField 
                    id="outlined-basic-german" label="Translation" name="translation" variant="outlined" 
                    onChange={(e) => {
                        setTrans(e.target.value);
                    }}
                />

                <Button onClick={async () => {
                    try {
                        await addWord(listName, source, trans);
                        window.location.reload();
                    } catch (error) {
                        console.error(error);
                    }
                }}>
                    Confirm
                </Button>
            </Box>
        </Modal>
    )
}