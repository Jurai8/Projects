// render view of all vocab lists similar to how vocab is rendered in heft
// functionality of each row:
    // when the user hovers over the row three dots should appear
    // when clicked (3 dots), a menu will show up, to either delete the collection or initiate a test or view the vocab list
    // Also when the user double clicks on the list they should be taken to heft.js where they can view the list they clicked on

    // future: while in heft.js, they should be able to choose specific words they want to be tested on (on a specific date)
    
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth";
import useFetchVocab, { useSetVocab } from "../hooks/useVocab";


export default function VocabLists() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // this will be used to create a new collection. Firebase will do it automatically
  const { newCollection, deletecollection } = useSetVocab(user);

  const { getVocabLists } = useFetchVocab(user);

  const [rows, setRows] = useState([]);

  const [newCollectionModal, setNewCollectionModal] = useState(false);

  const closeNewCollectionModal = () => setNewCollectionModal(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const closeMenu = () => {
    setAnchorEl(null);
  }

  useEffect(() => {
    const getlists = async () => {
      try {
        const lists = await getVocabLists();

        setRows(lists);

      } catch (error) {
        console.error(error)
      }
    }

    getlists();

  }, [getVocabLists])

  // decide which version to render depending on whether the user is coming from test or not
  return (
    <>
      <h1>Your vocab lists</h1>
      <div className='table-position'>
        <div className="button-container">

          <Button variant="contained" onClick={() => 
            setNewCollectionModal(true)
          }>          
            New Collection 
          </Button>
        </div>  
        

        <NewCollectionModal  open={newCollectionModal} close={closeNewCollectionModal} createCollection={newCollection}/>

        <TableContainer className="table-container" component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" className="template-table">
            <TableHead>
              <TableRow>
                <TableCell> List Name </TableCell>
                <TableCell align="right" colSpan={2}>Words&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.listName}
                  className='template-table-row'
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onDoubleClick={() => {
                    navigate(`/vocablists/${row.listName}`, { state: {
                      listName: row.listName
                    }});
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.listName}
                  </TableCell>
                  <TableCell align="right">{row.vocabCount}</TableCell>

                  <DeleteMenu anchorEl={anchorEl} handleClose={closeMenu}
                    deleteCollection={deletecollection} collection={row.listName}
                  />

                  <TableCell align="right" id='more-icon-vocab-list'>
                      <IconButton onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                      }}>
                          <MoreVertIcon />
                      </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>  
  );
}

function NewCollectionModal({ open, close, createCollection }) {

  const navigate = useNavigate();

  const [collection, setCollection] = useState("");

  const [source, setSource] = useState("");

  const [translation, setTranslation] = useState("");

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  // TODO: fix the appearance of the modal
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
            New Collection
        </Typography>

        <div>
          <TextField
            id='vocab-collection-name'
            placeholder="e.g Family"
            name='collection'
            label='collection-name'
            variant='outlined'
            onChange={(e) => setCollection(e.target.value)}
          />

          <TextField
            id='native'
            placeholder="e.g daughter"
            name='native'
            label="native"
            variant="outlined"
            onChange={(e) => setSource(e.target.value)}
          />

          <TextField
            id='translation'
            placeholder="e.g die Tocher"
            label="translation"
            variant="outlined"
            onChange={(e) => setTranslation(e.target.value)}
          />
        </div>
        
        <Button onClick={async () => {
          try {
            await createCollection(collection, source, translation);

            navigate(`/vocablists/${collection}`, { state: {
              listName: collection
            }});

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


function DeleteMenu({ anchorEl, handleClose, deleteCollection, collection }) {
  const open = Boolean(anchorEl);

  const deleteColl = async () => {
    handleClose();

    console.log(typeof deleteCollection);
    
    try {
      await deleteCollection(collection);

      alert("Collection has been deleted");

     // window.location.reload();

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={async () => deleteColl()}>Delete</MenuItem>
    </Menu>
    
  );
}