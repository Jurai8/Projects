import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Vocab } from './Learner';
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


