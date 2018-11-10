const axios = require('axios');

function StockMarket(){
  this._apiKey = process.env.ALPHA_KEY;
  this._url = process.env.ALPHA_URL;
}

StockMarket.prototype.searchExchange = function(searchWord){
  let params = {
    function: 'SYMBOL_SEARCH',
    keywords: searchWord,
    apikey: this._apiKey
  };
  return axios.get(this._url,{params: params});
};

StockMarket.prototype.getExchangeQuote = function(symbol){
  let params = {
    function: 'GLOBAL_QUOTE',
    symbol: symbol,
    apikey: this._apiKey
  };
  return axios.get(this._url,{params: params});
};

StockMarket.prototype.getExchangeIntraday = function(symbol, interval, outputSize){
  let params = {
    function: 'TIME_SERIES_INTRADAY',
    symbol: symbol,
    interval: interval + 'min',
    outputsize: outputSize,
    apikey: this._apiKey
  };
  return axios.get(this._url,{params: params});
};

StockMarket.prototype.getExchangeDaily = function(symbol, outputSize){
  let params = {
    function: 'TIME_SERIES_DAILY',
    symbol: symbol,
    outputsize: outputSize,
    apikey: this._apiKey
  };
  return axios.get(this._url,{params: params});
};

StockMarket.prototype.getExchangeWeekly = function(symbol){
  let params = {
    function: 'TIME_SERIES_WEEKLY',
    symbol: symbol,
    apikey: this._apiKey
  };
  return axios.get(this._url,{params: params});
};

StockMarket.prototype.getExchangeMonthly = function(symbol){
  let params = {
    function: 'TIME_SERIES_MONTHLY',
    symbol: symbol,
    apikey: this._apiKey
  };
  return axios.get(this._url,{params: params});
};

module.exports = function(){
  return StockMarket;
};