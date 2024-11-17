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
import { Vocab } from '../functions/vocab';
import { getAuth } from 'firebase/auth';

// get the array from UserVocabLists
// each index will be a row in the sidebar


// pass onclick function here
export default function Sidebar({ isSidebarOpen, toggleSidebar, getListName, toggleNewCollectionModal }) { 
    const auth = getAuth();
    const user = auth.currentUser;
    
    const [vocabLists, setVocabLists] = useState([]);

    // when user auth (user signed in) changes
    const vocab = useMemo(() => {
      if (user) {
        // return Vocab obj
        return new Vocab(user);
      } else {
        console.log("user not authenticated, function: Sidebar");
        alert("not signed in yet");
        return null;
      }
    }, [user]);

    // when the vocab obj has been defined
    useEffect(() => {
      if (vocab) {
        // get all the lists that the user has
        const fetchVocabLists = async () => {
          const lists = await vocab.getAllVocabLists();
    
          // Ensure unique lists before updating state
          const uniqueLists = [...new Map(lists.map(list => [list.listName, list])).values()];

          setVocabLists(uniqueLists);
        };

        fetchVocabLists();
      }  

    }, [vocab]);


    const SidebarList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleSidebar(false)
        }>
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
              {vocabLists.map((list, index) => (
              <ListItem key={index} disablePadding>
                {/* get name of list that was clicked on */}
                  <ListItemButton onClick={() => getListName(list.listName)}>
                  <ListItemIcon>
                      <LibraryBooksIcon />
                  </ListItemIcon>
                  <ListItemText primary={list.listName} />
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
