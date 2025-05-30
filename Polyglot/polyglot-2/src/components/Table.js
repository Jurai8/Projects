import '../App.css';
import { useState, useEffect, useMemo } from 'react';
import { getAuth } from 'firebase/auth';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { Vocab } from '../functions/vocab';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import useFetchVocab from '../hooks/useVocab';



export default function VocabBook({ vocab, openModal, getOriginalWord, openDeleteVocab, displayInfo}) {

  // keep track of the row that the user is on
  const [currWordPair, setCurrWordPair] = useState({});

  // keep wordInfo modal
  // allow user to delete and edit word within wordInfo modal. Check readera

  const displayMenu = () => {
    
  }

  return (
    <TableContainer id='table-container' component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" id="vocab-table">
        <TableHead>
          <TableRow>
            {/* replace with variables in future */}
            <TableCell>English</TableCell>
            <TableCell align="right" colSpan={2}>German</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vocab.map((row) => (
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
                <IconButton onClick={() => {displayInfo(true, row)}}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// TODO: complete the menu
function TableRowWithMenu({ row, openModal, getOriginalWord, openDeleteVocab, displayInfo}) {

  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition ] = useState({
    mouseX: null, mouseY: null 
  });
  const [wordpair, setWordpair] = useState({
    native: null, 
    translation: null, 
    event: 0
  });

  const open = Boolean(anchorEl);

  let updateWord;

  if (user) {
    updateWord = new Vocab(user);

  } else {
    alert("user not authenticated")
    console.log("User not signed in 1,2")
  }

  const handleContextMenu = (row, event) => {
    event.preventDefault();

    console.log("event.target:", event.target);
    console.log("event.currentTarget:", event.currentTarget);

    if (event.target.closest('.Row')) {
      const newPosition = {
        mouseX: event.clientX,
        mouseY: event.clientY
      };

      setMenuPosition(newPosition);
      setAnchorEl(event.currentTarget);
      // why am i trying to setwordpair, with it's own values?
      setWordpair({native: row.word, translation: row.translation});
    } else {

      setAnchorEl(null);
      setMenuPosition({ mouseX: null, mouseY: null });
    }

  };

  useEffect(() => {
    if (menuPosition.mouseX !== null && menuPosition.mouseY !== null) {
      console.log("Menu opened:", menuPosition, anchorEl, "Wordpair: ", wordpair);
    } else {
      console.log("Menu closed:", menuPosition, anchorEl);
    }
  }, [menuPosition, anchorEl]);


  const handleClose = () => {
    console.log("closing");
    setAnchorEl(null);
    setMenuPosition({ mouseX: null, mouseY: null });
    getOriginalWord(wordpair)
  };

  // open modal to display info of word
  
  return (
    <TableRow
      key={row.word}
      className='Row'
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onContextMenu={(e) => {handleContextMenu(row, e)}}
    >
      <TableCell component="th" className="native" scope="row">
        {row.word}
      </TableCell>
      <TableCell align="right" className="trans">
        {row.translation}
      </TableCell>
      
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition.mouseY !== null && menuPosition.mouseX !== null
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
        open={open}
        onClose={handleClose}    
      >
        <MenuItem onClick={() => {
          handleClose();
          openModal(2);
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose()
          openDeleteVocab()
        }}>
          Delete
        </MenuItem>
        <MenuItem onClick={() => {
          displayInfo(true, wordpair)
          handleClose()
        }}>
          Info
        </MenuItem>
      </Menu>
    </TableRow>
  );
}

export function ShowVocabLists ({ rows }) {

  const navigate = useNavigate();
  const { state } = useLocation();

  

  function renderTablerows() {

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={2} align="center"> 
            Getting your lists...
          </TableCell>
        </TableRow> 
      )
    }
  
    if (state) {
      return (
        rows.map((row) => (
          <TableRow
            key={row.listName}
            id="table-test-to-list"
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            onDoubleClick={() => {
              //! not replace isn't working as intended
              //TODO: change url to render testLearner
              navigate('/test/vocabtest', { 
                replace: true,
                state: row
              });
            }}
          >
            <TableCell component="th" scope="row">
              {row.listName}
            </TableCell>
            <TableCell align="right">{row.vocabCount}</TableCell>
          </TableRow>
        ))
      )
    } else {
      return (
        rows.map((row) => (
          <TableRow
            key={row.listName}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            onDoubleClick={() => {
              navigate(`/vocablists/${row.listName}`);
            }}
          >
            <TableCell component="th" scope="row">
              {row.listName}
            </TableCell>
            <TableCell align="right">{row.vocabCount}</TableCell>
          </TableRow>
        ))
      )
    }
  }

  console.log("state: ", state)
  
  return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>List Name </TableCell>
              <TableCell align="right">Words&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {renderTablerows()}
          </TableBody>
        </Table>
    </TableContainer>
  );
}



export function DisplayVocablists() {
  
}


             

              