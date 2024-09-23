// render view of all vocab lists similar to how vocab is rendered in heft
// functionality of each row:
    // when the user hovers over the row three dots should appear
    // when clicked (3 dots), a menu will show up, to either delete the collection or initiate a test or view the vocab list
    // Also when the user double clicks on the list they should be taken to heft.js where they can view the list they clicked on

    // future: while in heft.js, they should be able to choose specific words they want to be tested on

import { Vocab } from "../components/Learner"
import { useState, useEffect, } from "react"
import { getAuth, onAuthStateChanged} from "firebase/auth"
import * as React from 'react';
import { Button } from "@mui/material";
import { VocabList } from "../components/Table";

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
    const [show, setShow] = useState(false);
    
    const auth = getAuth();

    const uevent = () => {
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
    }

    useEffect(() => {
      console.log("rows", rows, "length: ", rows.length)
      if (rows.length > 0) {
        setShow(true);
      }
    }, [rows]); 


  return (
    <div>
      <h1>Your vocab lists</h1>
      <Button onClick={uevent}>click me</Button>
      {/* Conditionally render a message if rows are still empty */}
      {show ? (
        <VocabList rows={rows} />
      ) : (
        <p>Loading vocab lists...</p>
      )}
    </div>
  );
}

//! row.VocabList does not exist yet. (each name should be unique) 

//! row.wordCount does not exist 