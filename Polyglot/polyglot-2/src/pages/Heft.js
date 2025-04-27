import { Button,  } from '@mui/material';
import '../App.css';
import { DeleteWord, NewCollection, WordInfoModal } from '../components/Modal';
import { Vocab } from '../functions/vocab';
import { InputCheck } from '../functions/input';
import Sidebar from '../components/Sidebar';
import VocabBook from '../components/Table'
import React, { useState, useEffect, useMemo} from 'react';
import AddWord, { EditWord } from '../components/Modal';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useFetchVocab, { useSetVocab } from '../hooks/useVocab';

import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

/* // TODO: 
    if user has no vocab list
        display modal 
        values: Name of list, first word pair
        create new vocab list
        add vocab list name to "All_Vocab_List" collection
*/

//? define the modals outside of heft



export default function Heft () {
    // get list name

    const { user } = useAuth();

    const { getVocab } = useFetchVocab(user);

    // this contains the name of the list
    const { state } = useLocation();

    // vocab in the vocab table
    const [vocab, setVocab] = useState([]);

    const [listName, setListName] = useState();

    // control the wordInfo modal and pass the word whose data will be shown
    const [wordInfo, setWordInfo] = useState({
        show: false,
        word: "",
    });

    const openWordInfo = (word) => {
        setWordInfo({
            show: true,
            word: word,
        })
    }

    const closeWordInfoModal = () => {
        setWordInfo(false);
    }

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
        <h1>{listName}</h1>
        <div id='table-position'>
            <div className='button-container'>
                {/* "New Word" button which opens a modal*/}

                {/* Button to navigate back to collections view */}
                
            </div>

            {/* Add Word modal*/}


            {/* Edit Word modal  */}
    

            {/*Modal for delete vocab */}

            {/* modal displaying word info */}
            {/* close = displayinfo(false), split wordinfo into two*/}
            <WordInfoModal close={closeWordInfoModal} open={wordInfo.show} wordInfo={wordInfo.word} />
            

            {/* table displaying words from the collection */}
            <TableContainer id='table-container' component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table"
                id="vocab-table">
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
                                    className='vocab-table-row'
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" className="vocab-source" scope="row" >
                                        {row.word}
                                    </TableCell>
                                    
                                    <TableCell 
                                        align="right" 
                                        className='vocab-translation' 
                                        sx={{ paddingRight: "0px !important" }}
                                    >
                                        {row.translation}
                                    </TableCell>    
    
    
                                    {/* change the sizing of the margin/padding etc */}
                                    <TableCell align="right" id='more-icon' >
                                        {/* display info */}
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
    
                                </TableRow>
                            )) ):(

                            <TableRow>
                                <TableCell>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        )}
                        
                    </TableBody>
                </Table>
            </TableContainer>   
        </div>
        </>
       
    );
}
