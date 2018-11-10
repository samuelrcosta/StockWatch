module.exports.index = function(application, req, res){
  /*
  const axios = require('axios');
  
  axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => {
    //console.log(response.data.url);
    //console.log(response.data.explanation);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response.data));
  })
  .catch(error => {
    console.log(error);
  });
  */
  let word = "Petrobras";
  let StockMarket = new application.app.models.StockMarket();
  
  StockMarket.searchExchange(word)
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    console.log(error);
  });
};