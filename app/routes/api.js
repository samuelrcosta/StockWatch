module.exports = function(application){
  application.get('/api/search/:word', function (req, res){
    application.app.controllers.stock.search(application, req, res);
  });
  
  application.get('/api/quote/:symbol', function(req, res){
    application.app.controllers.stock.getQuote(application, req, res);
  });
  
  application.get(['/api/intraday/:symbol', '/api/intraday/:symbol/:interval', '/api/intraday/:symbol/:interval/:output'], function(req, res){
    application.app.controllers.stock.getExchangeIntraday(application, req, res);
  });
  
  application.get(['/api/daily/:symbol', '/api/daily/:symbol/:output'], function(req, res){
    application.app.controllers.stock.getExchangeDaily(application, req, res);
  });
  
  application.get('/api/weekly/:symbol', function(req, res){
    application.app.controllers.stock.getExchangeWeekly(application, req, res);
  });
  
  application.get('/api/monthly/:symbol', function(req, res){
    application.app.controllers.stock.getExchangeMonthly(application, req, res);
  });
};