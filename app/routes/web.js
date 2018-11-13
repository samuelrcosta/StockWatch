const homeCtrl = require('./../controllers/homeController');

module.exports = function(application) {
  
  const homeController = new homeCtrl();
  
  application.get('/', function (req, res) {
    homeController.index(application, req, res);
  });
  
};