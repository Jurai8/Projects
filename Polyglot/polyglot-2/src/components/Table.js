import '../App.css';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';


export function createData(word, translation) {
  return {word, translation};
}

// get word and translation from user vocablist subcollection
async function createRows() {
  const rows = {};

  // (Dyanamically!!) Query a reference to a subcollection
  const querySnapshot = await getDocs(collection(
    firestore, "Users", "Vocablist 1"
  ));

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  }); 
}
export default function VocabBook({ rows }) {
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