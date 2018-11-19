const db = require('./../../config/dbConnection');

class FavoriteStock{
  constructor(){
    this._connection = db;
  }
  
  getList(){
    let connection = this._connection();
    return new Promise(function(resolve, reject) {
      connection.query('select * from favorite_stock order by name asc', function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  
  insert(stock, callback){
    let connection = this._connection();
    return new Promise(function(resolve, reject) {
      connection.query('insert into favorite_stock set ? ', stock, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  
  delete(symbol, callback){
    let connection = this._connection();
    return new Promise(function(resolve, reject) {
      connection.query('delete from favorite_stock where symbol = ? ', symbol, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
}

module.exports = FavoriteStock;