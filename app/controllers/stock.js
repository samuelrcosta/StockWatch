function handleSuccess(res, resData){
  let responseData = {status: 'ok'};
  responseData.data = resData.data;
  res.json(responseData);
}

function handleReqError(res, errData){
  let responseData = {status: 'error'};
  responseData.code = errData.code;
  res.status(500);
  res.json(responseData);
}

module.exports.search = function(application, req, res){
  let word = req.params.word;
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.searchExchange(word)
  .then(response => {
    handleSuccess(res, response);
  })
  .catch(error => {
    handleReqError(res, error);
  });
};

module.exports.getQuote = function(application, req, res){
  let symbol = req.params.symbol;
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.getExchangeQuote(symbol)
  .then(response => {
    handleSuccess(res, response);
  })
  .catch(error => {
    handleReqError(res, error);
  });
};

module.exports.getExchangeIntraday = function (application, req, res) {
  let symbol = req.params.symbol;
  let interval = '1';
  let output = 'compact';
  
  if(req.params.interval){
    interval = req.params.interval;
    if(interval !== '1' && interval !== '5' && interval !== '15' && interval !== '30' && interval !== '60'){
      let error = {code: 'Invalid Interval'};
      handleReqError(res, error);
    }
  }
  
  if(req.params.output){
    output = req.params.output;
    if(output !== 'compact' && output !== 'full'){
      let error = {code: 'Invalid Output'};
      handleReqError(res, error);
    }
  }
  
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.getExchangeIntraday(symbol, interval, output)
  .then(response => {
    handleSuccess(res, response);
  })
  .catch(error => {
    handleReqError(res, error);
  });
};

module.exports.getExchangeDaily = function (application, req, res) {
  let symbol = req.params.symbol;
  let output = 'compact';
  
  if(req.params.output){
    output = req.params.output;
    if(output !== 'compact' && output !== 'full'){
      let error = {code: 'Invalid Output'};
      handleReqError(res, error);
    }
  }
  
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.getExchangeDaily(symbol, output)
  .then(response => {
    handleSuccess(res, response);
  })
  .catch(error => {
    handleReqError(res, error);
  });
};

module.exports.getExchangeWeekly = function (application, req, res) {
  let symbol = req.params.symbol;
  
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.getExchangeWeekly(symbol)
  .then(response => {
    handleSuccess(res, response);
  })
  .catch(error => {
    handleReqError(res, error);
  });
};

module.exports.getExchangeMonthly = function (application, req, res) {
  let symbol = req.params.symbol;
  
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.getExchangeMonthly(symbol)
  .then(response => {
    handleSuccess(res, response);
  })
  .catch(error => {
    handleReqError(res, error);
  });
};