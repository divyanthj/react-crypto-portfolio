import React, { Component } from 'react'
import axios from 'axios';
import api from '../data/api-keys'
import _ from 'lodash'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversion: null,
      coins: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }



  fetchData() {
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      method: 'GET',
      params: {
        limit: 50
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
    coins.data.forEach((coin) => {
      coinData.push({
        name: coin.name,
        circulating_supply: coin.circulating_supply,
        symbol: coin.symbol,
        rank: coin.cmc_rank,
        price: coin.quote.USD.price * this.state.conversion
      })
    });
    this.setState({
      coins: coinData
    });
  }



  render() {


    return (<div>
        Hello wprld
      </div>)
  }
}

export default App;
