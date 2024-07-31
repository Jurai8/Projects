import '../App.css';
import useState from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableRowWithMenu } from './Sidebar';


export default function VocabBook({ vocab, whichModal, openModal}) {

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
          {vocab.map((row) => (
            <TableRowWithMenu key={row.word} row={row} whichModal={whichModal} openModal={openModal}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}