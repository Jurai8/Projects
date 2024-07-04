import '../App.css';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { create } from '@mui/material/styles/createTransitions';

// word & translation need to become properties of an object
// the function needs to be a constructor

/* 
  export function CreateData(input) {
    this.word = input.native;
    this.translation = input.translation;
}

2. const rows = [(input) => {
    word: input.word,
    translation: input.translation

  PROBLEM!!!!: 
    IDK how to give send input to CreateData, without acutally calling create data, not can i send it to rows, without calling rows in Modal.js. None of the functions should be called in Modal.js, only Table.js as they are now.

    Solution?
      Move rows to Table.js
      Row will create a row but then be sent as a prop to VocabBook
      Maybe i can just render VocabBook in Modal.js while removing the modal?
      figure out if that's possible or if i can pass the prop without rendering in modal.js

      Note!!:
      Google, sharing state between two components react
}]
*/

export function createData(word, translation) {
  return {word, translation};
}

/* const rows = [
  createData('Red', 'Rot'),
  createData('Blue', 'Blau'),
  createData('Yellow', 'Gelb'),
  createData('The man', 'Der Mann'),
  createData('have', 'haben')
];
*/
export default function VocabBook({ input }) {

  // will this array keep grouwing, or will it reset?
  const rows = [
    createData('Red', 'Rot'),
    createData(input.native, input.translation)
  ]

  return (
    <TableContainer id='table-container' component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* replace with variables in future */}
            <TableCell>English</TableCell>
            <TableCell align="right">German</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>  
          {rows.map((row) => (
            // generate table row component for each row
            <TableRow
              key={row.word} // identify each row by row.word (each word must be unique)
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {/*the first value in the row */}
              <TableCell component="th" scope="row">
                {row.word} 
              </TableCell>
              <TableCell align="right">{row.translation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}