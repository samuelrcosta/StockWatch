class homeController{
  
  index(application, req, res){
    let pageData = {};
    pageData.title = 'StockWatch';
    
    res.render('index', pageData);
  };
  
}

module.exports = homeController;