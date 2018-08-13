import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import Typography from '@material-ui/core/Typography';
import format from '../utils/format'


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

  /*
    Show loading spinner instead of table while data is being fetched
  */

  if(props.isLoading) {
    return (<CircularProgress className={classes.progress} />)
  }

  /*
    Display Error message if Coinmarketcap API fails
  */

  if(props.isError) {
    return (<Paper>
              <Typography variant="headline" component="h3">
                Error!
              </Typography>
              <Typography component="p">
                Unable to fetch data
              </Typography>
            </Paper>)
  }

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
                <TableCell>{format.numberWithCommas(n.circulating_supply)}</TableCell>
                <TableCell>{format.numberWithCommas(n.price.toFixed(2))}</TableCell>
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
                <TableCell>{format.numberWithCommas((props.portfolio[n.symbol] * n.price).toFixed(2))}</TableCell>
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
               <h3>{format.numberWithCommas(props.totalValue)}</h3>
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
