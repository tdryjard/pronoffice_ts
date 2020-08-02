const db = require('../database')

const Premium = function createUser(user) {
  this.title = user.title;
  this.description = user.description;
  this.price = user.price;
  this.product_id = user.product_id;
  this.image_id = user.image_id;
  this.telegram = user.telegram;
  this.pronostiqueur = user.pronostiqueur;
  this.user_id = user.user_id;
}

Premium.create = (premium, result) => {
  db.query('INSERT INTO premium SET ?', [premium], (error, dbResult) => {
    if (error) {
      return result(error, null);
    }

    return result(null, { id: dbResult.insertId, ...premium });
  });
};

Premium.update = (userId, premium, result) => {
  db.query('UPDATE premium SET ? WHERE user_id = ?', [premium, userId], (error, response) => {
    if (error) {
      console.log(error)
      return result(error, null);
    }

    if (response.affectedRows === 0) {
      return result({ kind: 'not_found' }, null);
    }

    return result(null, { userId: Number(userId), ...premium });
  });
};

Premium.find = (pronostiqueur, result) => {
  db.query('SELECT title, description, image_id, price, product_id, price_id, user_id, rib FROM premium WHERE pronostiqueur = ?', [pronostiqueur], (err, dbResult) => {
    if (err) {
      console.log(err)
      return result({ err, status: 500 }, null);
    }
    if (!dbResult.length) {
      return result({ status: 404 }, null);
    }
    return result(null, dbResult[0]);
  });
};

Premium.findTelegram = (pronostiqueurId, result) => {
    db.query('SELECT telegram FROM premium WHERE user_id = ?', [pronostiqueurId], (err, dbResult) => {
      if (err) {
        console.log(err)
        return result({ err, status: 500 }, null);
      }
      if (!dbResult.length) {
        return result({ status: 404 }, null);
      }
      console.log(dbResult)
      return result(null, dbResult[0]);
    });
  };

  Premium.update = (userId, premium, result) => {
    db.query('UPDATE premium SET ? WHERE user_id = ?', [premium, userId], (error, response) => {
      if (error) {
        console.log(error)
        return result(error, null);
      }
  
      if (response.affectedRows === 0) {
        return result({ kind: 'not_found' }, null);
      }
  
      return result(null, { userId: Number(userId), ...premium });
    });
  };


module.exports = Premium