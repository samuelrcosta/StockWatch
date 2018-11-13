const stockMarket = require('./../models/StockMarket');

class apiController{
  
  constructor(){
    this._stockMarket = new stockMarket();
  }
  
  static handleReqError(res, errData){
    let responseData = {status: 'error'};
    responseData.code = errData.code;
    res.status(500);
    res.json(responseData);
  }
  
  static handleSuccess(res, resData){
    let responseData = {status: 'ok'};
    responseData.data = resData.data;
    res.json(responseData);
  }
  
  search(application, req, res){
    let word = req.params.word;
  
    this._stockMarket.searchExchange(word)
    .then(response => {
      this.constructor.handleSuccess(res, response);
    })
    .catch(error => {
      this.constructor.handleReqError(res, error);
    });
  };
  
  getQuote(application, req, res){
    let symbol = req.params.symbol;
  
    this._stockMarket.getExchangeQuote(symbol)
    .then(response => {
      this.constructor.handleSuccess(res, response);
    })
    .catch(error => {
      this.constructor.handleReqError(res, error);
    });
  };
  
  getExchangeIntraday(application, req, res) {
    let symbol = req.params.symbol;
    let interval = '1';
    let output = 'compact';
    
    if(req.params.interval){
      interval = req.params.interval;
      if(interval !== '1' && interval !== '5' && interval !== '15' && interval !== '30' && interval !== '60'){
        let error = {code: 'Invalid Interval'};
        this.constructor.handleReqError(res, error);
      }
    }
    
    if(req.params.output){
      output = req.params.output;
      if(output !== 'compact' && output !== 'full'){
        let error = {code: 'Invalid Output'};
        this.constructor.handleReqError(res, error);
      }
    }
  
    this._stockMarket.getExchangeIntraday(symbol, interval, output)
    .then(response => {
      this.constructor.handleSuccess(res, response);
    })
    .catch(error => {
      this.constructor.handleReqError(res, error);
    });
  };
  
  getExchangeDaily(application, req, res) {
    let symbol = req.params.symbol;
    let output = 'compact';
    
    if(req.params.output){
      output = req.params.output;
      if(output !== 'compact' && output !== 'full'){
        let error = {code: 'Invalid Output'};
        this.constructor.handleReqError(res, error);
      }
    }
  
    this._stockMarket.getExchangeDaily(symbol, output)
    .then(response => {
      this.constructor.handleSuccess(res, response);
    })
    .catch(error => {
      this.constructor.handleReqError(res, error);
    });
  };
  
  getExchangeWeekly(application, req, res) {
    let symbol = req.params.symbol;
  
    this._stockMarket.getExchangeWeekly(symbol)
    .then(response => {
      this.constructor.handleSuccess(res, response);
    })
    .catch(error => {
      this.constructor.handleReqError(res, error);
    });
  };
  
  getExchangeMonthly(application, req, res) {
    let symbol = req.params.symbol;
  
    this._stockMarket.getExchangeMonthly(symbol)
    .then(response => {
      this.constructor.handleSuccess(res, response);
    })
    .catch(error => {
      this.constructor.handleReqError(res, error);
    });
  };
}

module.exports = apiController;