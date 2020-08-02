const db = require('../database')

const User = function createUser(user) {
  this.pseudo = user.pseudo;
  this.password = user.password;
}

User.create = (newUser, result) => {
  db.query('INSERT INTO user SET ?', [newUser], (error, dbResult) => {
    if (error) {
      return result(error, null);
    }

    return result(null, { id: dbResult.insertId, ...newUser });
  });
};

User.connect = function userConnect(pseudo, result) {
  console.log(pseudo)
  db.query('SELECT * FROM user WHERE pseudo = ?', [pseudo], (err, dbResult) => {
    if (err) {
      return result({ err, status: 500 }, null);
    }
    if (!dbResult.length) {
      return result({ status: 404 }, null);
    }
    return result(null, dbResult[0]);
  });
};

User.update = (userId, newUser, result) => {
  db.query('UPDATE user SET ? WHERE id = ?', [newUser, userId], (error, response) => {
    if (error) {
      console.log(error)
      return result(error, null);
    }

    if (response.affectedRows === 0) {
      return result({ kind: 'not_found' }, null);
    }

    return result(null, { userId: Number(userId), ...newUser });
  });
};

User.changeLog = (userId, newUser, result) => {
  db.query('UPDATE user SET ? WHERE id = ?', [newUser, userId], (error, response) => {
    if (error) {
      console.log(error)
      return result(error, null);
    }

    if (response.affectedRows === 0) {
      return result({ kind: 'not_found' }, null);
    }

    return result(null, { userId: Number(userId), ...newUser });
  });
};

User.compareKeyReset = function userConnect(userId, result) {
  db.query('SELECT key_reset FROM user WHERE id = ?', [userId], (err, dbResult) => {
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


module.exports = User