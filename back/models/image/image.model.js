const db = require('../database')

const Image = function createBase64Image(image) {
    this.base = image.base;
}

Image.create = (newImage, result) => {
    db.query('INSERT INTO image SET ?', [newImage], (error, dbResult) => {
        if (error) {
            console.log(error)
            return result(error, null)
        }

        return result(null, { id: dbResult.insertId, ...newImage })
    })
};

Image.find = (id, result) => {
    db.query(
        'SELECT * FROM image WHERE id = ?',
        [id],
        (error, dbResult) => {
            if (error) {
                console.log(error)
                return result(error, null);
            }

            if (dbResult.length) {
                return result(null, dbResult);
            }

            return result({ kind: 'not_found' }, null);
        }
    );
};

Image.update = (id, image, result) => {
    db.query('UPDATE image SET ? WHERE id = ?', [image, id], (error, response) => {
        if (error) {
            console.log(error)
            return result(error, null);
        }

        if (response.affectedRows === 0) {
            return result({ kind: 'not_found' }, null);
        }

        return result(null, { id: Number(id), ...image });
    });
};

Image.delete = (id, result) => {
    db.query('DELETE FROM image WHERE id = ?', [id], err => {
      if (err) return result({ message: err.message, status: 500 }, null);
  
      return result(null, {
        message: `image supprimée`,
        status: 200
      });
    });
  };

module.exports = Image