const axios = require('axios');

class StockMarket{
  constructor(){
    this._apiKey = process.env.ALPHA_KEY;
    this._url = process.env.ALPHA_URL;
  }
  
  searchExchange(searchWord){
    let params = {
      function: 'SYMBOL_SEARCH',
      keywords: searchWord,
      apikey: this._apiKey
    };
    return axios.get(this._url,{params: params});
  };
  
  getExchangeQuote(symbol){
    let params = {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: this._apiKey
    };
    return axios.get(this._url,{params: params});
  };
  
  getExchangeIntraday(symbol, interval, outputSize){
    let params = {
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: interval + 'min',
      outputsize: outputSize,
      apikey: this._apiKey
    };
    return axios.get(this._url,{params: params});
  };
  
  getExchangeDaily(symbol, outputSize){
    let params = {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: outputSize,
      apikey: this._apiKey
    };
    return axios.get(this._url,{params: params});
  };
  
  getExchangeWeekly(symbol){
    let params = {
      function: 'TIME_SERIES_WEEKLY',
      symbol: symbol,
      apikey: this._apiKey
    };
    return axios.get(this._url,{params: params});
  };
  
  getExchangeMonthly(symbol){
    let params = {
      function: 'TIME_SERIES_MONTHLY',
      symbol: symbol,
      apikey: this._apiKey
    };
    return axios.get(this._url,{params: params});
  };
}

module.exports = StockMarket;