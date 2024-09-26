// render view of all vocab lists similar to how vocab is rendered in heft
// functionality of each row:
    // when the user hovers over the row three dots should appear
    // when clicked (3 dots), a menu will show up, to either delete the collection or initiate a test or view the vocab list
    // Also when the user double clicks on the list they should be taken to heft.js where they can view the list they clicked on

    // future: while in heft.js, they should be able to choose specific words they want to be tested on (on a specific date)

import { Vocab } from "../components/Learner"
import { useState, useEffect, } from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth"
import * as React from 'react';
import { Button } from "@mui/material";
import { VocabList } from "../components/Table";
import { Component } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function VocabLists() {
  // update the
  const auth = getAuth();
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [rowsInitialized, setRowsInitialized] = useState(false);

  /*const uevent = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const vocab = new Vocab(user);

        try {
          const row = await vocab.getAllVocabLists();
  
          console.log("row from getAllVocabLists:", row, show);
  
          console.log("hello")
          setRows(row); // Update state
        
          console.log(rows);
  
        } catch (error) {
          console.error(error);
        }

      } else {
        alert("user not signed in")
      }
    });
  } */

  const uevent = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const vocab = new Vocab(user);
  
          try {
            const row = await vocab.getAllVocabLists();
            resolve(row);  // Resolve with the array of vocab lists
          } catch (error) {
            console.error(error);
            reject(error);  // Handle error
          }
  
        } else {
          alert("user not signed in");
          reject("user not signed in");  // Reject if not signed in
        }
      });
    });
  };

  // uvent should return the array
  // then set state with value from uvent
  // useEffect can track if the value has changed 
  // if it has setShow(true)
  // remove length

  useEffect(() => {
    const fetchData = async () => {
      try {
        const call = await uevent();  
        setRows(call);  // Set state with the returned data
        setRowsInitialized(true);
      } catch (error) {
        console.error("Error fetching vocab lists:", error);
      }
    };
  
    fetchData();  // Call the function once on component mount
  }, []);  // Empty dependency array to run only on mount


    useEffect(() => {
      if (rows.length > 0) {
        console.log("Rows updated in useEffect: ", rows, "length: ", rows.length);
        setShow(true);  // Only show if rows exist
      } else {
        console.log("Rows length is 0, no vocab lists found.");
      }
    }, [rows]);


  return (
    <div>
      <h1>Your vocab lists</h1>
      {/* Conditionally render a message if rows are still empty */}
      {show && 
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
      }
      
    </div>
  );
}