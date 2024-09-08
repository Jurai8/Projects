import '../App.css';
import { useState, useEffect, useMemo } from 'react';
import { getAuth } from 'firebase/auth';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Vocab } from './Learner';



export default function VocabBook({ vocab, openModal, getOriginalWord}) {

  return (
    <TableContainer id='table-container' component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* replace with variables in future */}
            <TableCell>English</TableCell>
            <TableCell align="right">German</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vocab.map((row) => (
            <TableRowWithMenu key={row.word} row={row} openModal={openModal} getOriginalWord={getOriginalWord}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// TODO: Make it so that the menu shows up upon hover
function TableRowWithMenu({ row, openModal, getOriginalWord}) {
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

  const auth = getAuth();
  const user = auth.currentUser;
  let updateWord;

  if (user) {
    updateWord = new Vocab(user);

  } else {
    alert("user not authenticated")
    console.log("User not signed in")
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
        BackdropProps={{ invisible: true }}
    
      >
        <MenuItem onClick={() => {
          const number = 2;
          handleClose();
          // replace
          openModal(number);
          // call edit word method
          // args = string (native/translation) send as obj ? + new word
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </TableRow>
  );
}