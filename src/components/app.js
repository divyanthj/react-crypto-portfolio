import React, { Component } from 'react'
import axios from 'axios';
import api from '../data/api-keys'
import _ from 'lodash'
import Table from './table.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      conversion: null,
      coinData: [],
      coinColumns:[
        'Rank',
        'Name (Symbol)',
        'Circulating Supply',
        'Price (INR)',
        'My Holdings',
        'My Holdings Value (INR)'
      ],
      portfolio: {},
      totalValue: 0
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  /*
    Handler for detecting changes to portfolio
  */

  handlePortfolioChange(value, symbol) {
    let portfolio = this.state.portfolio;
    portfolio[symbol] = value;
    this.setState({
      portfolio: portfolio
    });
    this.updateLocalStorage();
    this.getTotal();
  }

  /*
    Calculate total portfolio Value
  */

  getTotal() {
    let total = 0;
    this.state.coinData.forEach((coin) => {
      total += coin.price * this.state.portfolio[coin.symbol];
    })
    console.log("Total", total);
    this.setState({
      totalValue: total.toFixed(2)
    })
  }

  /*
    Update local storage with current portfolio
  */

  updateLocalStorage() {
    let keys = Object.keys(this.state.portfolio);
    keys.forEach((key) => {
      localStorage.setItem(key, this.state.portfolio[key]);
    });
  }


  /*
    Fetch Coin data and conversion data from API
  */

  fetchData() {
    axios.get('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      method: 'GET',
      params: {
        // limit: 10
      },
      headers: {
        'X-CMC_PRO_API_KEY': api.key
      }
    }).then((res) => {
        // Success response for CoinmarketCap API
        let data = res.data
        // CoinmarketCap API didn't support INR conversions in the free version. So, getting current USD-INR value from another API
        axios.get('https://free.currencyconverterapi.com/api/v6/convert?q=USD_INR&compact=ultra', {
          method: 'GET'
        }).then((res) => {
          // Success response for USD/INR conversion API
          this.setState({
            conversion: res.data.USD_INR,
            loading: false
          });
          this.makeData(data);
        }, () => {
          // Failure response for USD/INR conversion API
          this.setState({
            conversion: 69,
            loading: false
          });
          this.makeData(data);
        })
    }, (res) => {
      this.setState({
        loading: false,
        error: true
      })
    });
  }

  /*
    Reorganize data for the app
  */

  makeData(coins) {
    let coinData = [];
    let portfolio = {};
    coins.data.forEach((coin) => {
      coinData.push({
        name: coin.name,
        circulating_supply: coin.circulating_supply,
        symbol: coin.symbol,
        rank: coin.cmc_rank,
        price: coin.quote.USD.price * this.state.conversion
      });
      portfolio[coin.symbol] = localStorage.getItem(coin.symbol) || 0;
    });
    this.setState({
      coinData: coinData,
      portfolio: portfolio
    });
    this.getTotal();
  }

  render() {
    return (
      <Table isLoading={this.state.loading}
             isError={this.state.error}
             coinData={this.state.coinData}
             coinColumns={this.state.coinColumns}
             portfolio={this.state.portfolio}
             handlePortfolioChange={this.handlePortfolioChange.bind(this)}
             totalValue={this.state.totalValue}></Table>)
  }
}

export default App;
