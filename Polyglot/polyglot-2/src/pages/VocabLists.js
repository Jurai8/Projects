// render view of all vocab lists similar to how vocab is rendered in heft
// functionality of each row:
    // when the user hovers over the row three dots should appear
    // when clicked (3 dots), a menu will show up, to either delete the collection or initiate a test or view the vocab list
    // Also when the user double clicks on the list they should be taken to heft.js where they can view the list they clicked on

    // future: while in heft.js, they should be able to choose specific words they want to be tested on

import { Vocab } from "../components/Learner"
import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth"
import * as React from 'react';
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function VocabLists() {
    /** 
    //TODO call a method from learner.js. The method should return an array of all the active vocablists that the user has. Each index will be an object with the properties - listName & wordCount/vocabCount

    //! e.g 
    const auth = get auth
    **get signed in user, 
    const vocab = new Vocab(user);
    const rows = vocab.getUserVocabLists();
    rows[0].Listname = Family;
    rows[0].wordCount = 5;
    */

    /*
    const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];  
    */
    
    const [rows, setRows] = useState([]);

    const auth = getAuth();

    function Event() {
      useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const vocab = new Vocab(user);
            const row = await vocab.getAllVocabLists();
  
            console.log("row from getAllVocabLists:", row);
              
            setRows(row);
  
          } else {
              alert("user not signed in")
            }
        });
      }, [])
    }

    

  return (
    <div>
      <h1>Your vocab list</h1>

      <Button onClick={Event}>
        click me
      </Button>

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
  );
}


//! row.VocabList does not exist yet. (each name should be unique) 

//! row.wordCount does not exist 