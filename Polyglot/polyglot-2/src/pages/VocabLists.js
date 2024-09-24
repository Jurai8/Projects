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
import { Component } from "react";

export default function VocabLists() {
  
    const auth = getAuth();

    const [rows, setRows] = useState([]);
    const [show, setShow] = useState(false);
    const [length, setLength] = useState(0);
 
    const uevent = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const vocab = new Vocab(user);
  
          try {
            const row = await vocab.getAllVocabLists();
    
            console.log("row from getAllVocabLists:", row, show);
    
            console.log("hello")
            setRows(row); // Update state
            setLength(row.length);
    
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
      console.log("rows", rows, "length: ", length)
      if (length > 0) {
        setShow(true);
      }
    }, [rows, length]);


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