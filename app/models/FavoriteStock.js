const db = require('./../../config/dbConnection');

class FavoriteStock{

  getList(){
    return new Promise((resolve, reject) => {
      db.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('select * from favorite_stock order by name asc', function (err, rows) {
          // When done with the connection, release it.
          connection.release();

          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  };
  
  insert(stock){
    return new Promise((resolve, reject) => {
      db.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('insert into favorite_stock set ? ', stock, function (err, rows) {
          // When done with the connection, release it.
          connection.release();
          
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  }
  
  delete(symbol){
    return new Promise((resolve, reject) => {
      db.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('delete from favorite_stock where symbol = ? ', symbol, function (err, rows) {
          // When done with the connection, release it.
          connection.release();

          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  }
}

module.exports = FavoriteStock;