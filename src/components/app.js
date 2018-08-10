import React, { Component } from 'react'
import axios from 'axios';
import api from '../data/api-keys'
import _ from 'lodash'
import Table from './table.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handlePortfolioChange(value, symbol) {
    let portfolio = this.state.portfolio;
    portfolio[symbol] = value;
    this.setState({
      portfolio: portfolio
    });
    this.updateLocalStorage();
    this.getTotal();
  }

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

  updateLocalStorage() {
    let keys = Object.keys(this.state.portfolio);
    keys.forEach((key) => {
      localStorage.setItem(key, this.state.portfolio[key]);
    });
  }




  fetchData() {
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      method: 'GET',
      params: {
        limit: 5
      },
      headers: {
        'X-CMC_PRO_API_KEY': api.key,
        'Content-Type': 'application/jsonp',
      }
    }).then((res) => {
        let data = res.data
        axios.get('https://free.currencyconverterapi.com/api/v6/convert?q=USD_INR&compact=ultra', {
          method: 'GET'
        }).then((res) => {
          this.setState({
            conversion: res.data.USD_INR
          });
          this.makeData(data);
        }, () => {
          this.setState({
            conversion: 69
          });
          this.makeData(data);
        })
    })
  }

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
    return (<Table coinData={this.state.coinData}
                   coinColumns={this.state.coinColumns}
                   portfolio={this.state.portfolio}
                   handlePortfolioChange={this.handlePortfolioChange.bind(this)}
                   totalValue={this.state.totalValue}></Table>)
  }
}

export default App;
