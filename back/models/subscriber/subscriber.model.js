const db = require('../database')

const Subcriber = function createSub(subscriber) {
  this.email = subscriber.email;
  this.name = subscriber.name;
  this.user_id = subscriber.user_id;
  this.customer_id = subscriber.customer_id;
}

Subcriber.create = (subscriber, result) => {
  db.query('INSERT INTO subscriber SET ?', [subscriber], (error, dbResult) => {
    if (error) {
      return result(error, null);
    }

    return result(null, { id: dbResult.insertId, ...subscriber });
  });
};

module.exports = Subcriber