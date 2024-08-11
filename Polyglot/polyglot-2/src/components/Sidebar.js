import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
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
    let vocab;

    if (user != null) {
      vocab = new Vocab(user);

    } else {
      console.log("user not authenticated, function: Sidebar")
    }

    // Fetch vocab lists on component mount
    // how to fetch before component mount???
    useEffect(() => {
      const fetchVocabLists = async () => {
        try {
            console.log("Fetching vocab lists...");
            const vocabListNames = await vocab.getAllVocabLists();
            console.log(`UseEffect: ${vocabListNames}`);
            setRows(vocabListNames);
        } catch (error) {
            console.error("Error fetching vocab lists:", error);
        }
      };

      fetchVocabLists();
        // run useEffect only once after render
    },[]);


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
export function TableRowWithMenu({ row, whichModal, openModal }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition ] = useState({mouseX: null, mouseY: null });
  const open = Boolean(anchorEl);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY
    });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuPosition({ mouseX: null, mouseY: null });
  };

  return (
    <TableRow
      key={row.word}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      // on my mac it works when i tap with two fingers, but when i right click
      onContextMenu={handleContextMenu}
      onClick={console.log(row)}
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
      >
        <MenuItem onClick={() => {
          handleClose();
          whichModal(false);
          openModal();
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </TableRow>
  );
}

