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


export function createData(word, translation) {
  return {word, translation};
}

/*Problem: new rows aren't being created 
  Solution: a function that creates new row arrays? - 
    when confirm is clicked create a new array? create a new element?
  Or: reset the array?*/
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