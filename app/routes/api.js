const apiCtrl = require('./../controllers/apiController');

module.exports = function(application){
  
  const apiController = new apiCtrl();
  
  application.get('/api/search/:word', function (req, res){
    apiController.search(application, req, res);
  });
  
  application.get('/api/quote/:symbol', function(req, res){
    apiController.getQuote(application, req, res);
  });
  
  application.get(['/api/intraday/:symbol', '/api/intraday/:symbol/:interval', '/api/intraday/:symbol/:interval/:output'], function(req, res){
    apiController.getExchangeIntraday(application, req, res);
  });
  
  application.get(['/api/daily/:symbol', '/api/daily/:symbol/:output'], function(req, res){
    apiController.getExchangeDaily(application, req, res);
  });
  
  application.get('/api/weekly/:symbol', function(req, res){
    apiController.getExchangeWeekly(application, req, res);
  });
  
  application.get('/api/monthly/:symbol', function(req, res){
    apiController.getExchangeMonthly(application, req, res);
  });
};