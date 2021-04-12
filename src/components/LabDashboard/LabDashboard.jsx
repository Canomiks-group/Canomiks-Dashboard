import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Divider, Button } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(lotNumber, companyName, dateReceived, testPhase) {
  return { lotNumber, companyName, dateReceived, dateReceived, testPhase };
}

const rows = [
  createData('0013R3', 'CompanyName', '4/10/21', 'Pre-shipment'),
  createData('L0800J', 'CompanyName', '4/10/21', 'Complete'),
  createData('401ZD', 'CompanyName', '4/10/21', 'In Vitro'),
  createData('000112', 'CompanyName', '4/10/21', 'RNA'),
  createData('JMG212', 'CompanyName', '4/10/21', 'RNA'),
];

export default function AdminDashboard() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4">Lab Dashboard</Typography>
      <Divider />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Lot #</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Date Received</TableCell>
              <TableCell align="right">Test Phase</TableCell>
              <TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.lotNumber}>
                <TableCell component="th" scope="row">
                  Lot #{row.lotNumber}
                </TableCell>
                <TableCell align="right">{row.companyName}</TableCell>
                <TableCell align="right">{row.dateReceived}</TableCell>
                <TableCell align="right">{row.testPhase}</TableCell>
                <TableCell align="right">
                  <Button variant="contained">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
