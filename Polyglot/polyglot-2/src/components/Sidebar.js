import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Vocab } from './Learner';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TableRow, TableCell } from '@mui/material';
import { getAuth } from 'firebase/auth';

// get the array from UserVocabLists
// each index will be a row in the sidebar


// pass onclick function here
export default function Sidebar({ isSidebarOpen, toggleSidebar, getListName, toggleNewCollectionModal }) { 
    // get all vocab lists belonging to user
    // State to hold vocab lists
    const [rows, setRows] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;

    const vocab = useMemo(() => {
      if (user) {
        return new Vocab(user);
      } else {
        console.log("user not authenticated, function: Sidebar");
        return null;
      }
    }, [user]);

    useEffect(() => {
      if (vocab) {
        const fetchVocabLists = async () => {
          try {
            console.log("Fetching vocab lists...");
            const vocabListNames = await vocab.getAllVocabLists();
            console.log(`UseEffect: ${vocabListNames}`);
            if (vocabListNames.length > 0) {
              setRows(prevRows => [...new Set([...prevRows, ...vocabListNames])]); // Set removes duplicates
            }
          } catch (error) {
            console.error("Error fetching vocab lists:", error);
          }
        };
    
        fetchVocabLists();
      }
    }, [vocab]);


    const SidebarList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleSidebar(false)}>
        <List>
            <ListItem key={"New"} disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <LibraryAddIcon /> 
                </ListItemIcon>
                <ListItemText primary={"New Collection"} 
                  // set state handler true, for create vocab collection function in heft
                  onClick={() => {toggleNewCollectionModal(true)}}
                 />
                </ListItemButton>
            </ListItem>
            {rows.map((text, index) => (
            <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => getListName(text)}>
                <ListItemIcon>
                     <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
            ))}
        </List>
        <Divider />
        </Box>
    );

    return (
        <div>
        <Drawer open={isSidebarOpen} onClose={toggleSidebar(false)}>
            {SidebarList}
        </Drawer>
        </div>
    );
}


// right click show menu
// TODO: the menu needs to show up when ever i right click on the row
//        currently, i opens on the first click then closes on the second
export function TableRowWithMenu({ row, whichModal, openModal }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition ] = useState({
    mouseX: null, mouseY: null 
  });
  const [wordpair, setWordpair] = useState({word: null, translation: null});

  const open = Boolean(anchorEl);

  const handleContextMenu = (wordpair, event) => {
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
      setWordpair({word: wordpair.word, translation: wordpair.translation});
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
  };

  return (
    <TableRow
      key={row.word}
      className='Row'
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onContextMenu={(e) => {handleContextMenu(row, e)}}
    >
      <TableCell component="th" scope="row">
        {row.word}
      </TableCell>
      <TableCell align="right">{row.translation}</TableCell>
      
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
          handleClose();
          // whichModal(false);
          openModal();
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

