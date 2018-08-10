import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import TextField from '@mate
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});




function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {
              props.coinColumns.map((column) => {
                return (<TableCell>{column}</TableCell>)
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {props.coinData.map(n => {
            return (
              <TableRow>
                <TableCell>{n.rank}</TableCell>
                <TableCell>{n.name} ({n.symbol})</TableCell>
                <TableCell>{n.circulating_supply}</TableCell>
                <TableCell>{n.price.toFixed(2)}</TableCell>
                <TableCell>
                <TextField
                  id="number"
                  value={props.portfolio[n.symbol]}
                  type="number"
                  onChange={e => props.handlePortfolioChange(e.target.value, n.symbol)}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
                </TableCell>
                <TableCell>{(props.portfolio[n.symbol] * n.price).toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>Total Portfolio Value</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell variant='footer'>
               <h3>{props.totalValue}</h3>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
