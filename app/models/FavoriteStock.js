const db = require('./../../config/dbConnection');

class FavoriteStock{
  constructor(){
    this._connection = db;
  }
  
  getList(){
    return new Promise((resolve, reject) => {
      this._connection.query('select * from favorite_stock order by name asc', function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  
  insert(stock){
    return new Promise((resolve, reject) => {
      this._connection.query('insert into favorite_stock set ? ', stock, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  
  delete(symbol){
    return new Promise((resolve, reject) => {
      this._connection.query('delete from favorite_stock where symbol = ? ', symbol, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
}

module.exports = FavoriteStock;