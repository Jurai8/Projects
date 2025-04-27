// render view of all vocab lists similar to how vocab is rendered in heft
// functionality of each row:
    // when the user hovers over the row three dots should appear
    // when clicked (3 dots), a menu will show up, to either delete the collection or initiate a test or view the vocab list
    // Also when the user double clicks on the list they should be taken to heft.js where they can view the list they clicked on

    // future: while in heft.js, they should be able to choose specific words they want to be tested on (on a specific date)
    
    
import { Button } from "@mui/material";
import { NewCollection } from "../components/Modal";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import { ShowVocabLists } from "../components/Table";
import { Vocab } from "../functions/vocab";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import useFetchVocab from "../hooks/useVocab";


export default function VocabLists() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { getVocabLists } = useFetchVocab(user);

  const [rows, setRows] = useState([]);

  const [newVocabCollection, setNewVocabCollection] = useState(false);
  const toggleNewCollectionModal = (bool) => setNewVocabCollection(bool);


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
      <div>
        <h1>Your vocab lists</h1>
          
        <Button variant="contained" onClick={() => 
        toggleNewCollectionModal(true)
        }>          
          New Collection 
        </Button>

        <Button variant="contained">          
          Schedule Test
        </Button>

        {newVocabCollection && 
          <NewCollection 
            toggleNewCollectionModal={toggleNewCollectionModal}
          />
        }

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>List Name </TableCell>
                <TableCell align="right">Words&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.listName}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>  
  );
}

