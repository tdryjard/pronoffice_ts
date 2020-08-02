const Image = require('../../models/image/image.model')
const checkToken = require('../../middlewares/webToken/checkToken')
const checkTokenCookie = require('../../middlewares/webToken/checkTokenCookie')

exports.create = function createAbase64(request, response) {

  if (!request.body) {
    return response.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  const image = new Image({
    base: request.body.base
  })

  return Image.create(image, (error, data) => {
    if (error) {
      return response.status(500).send({
        message:
          error.message || 'Some error occurred while creating the category.'
      })
    }

    const checkingToken = checkToken(request, response)
    const checkingTokenCookie = checkTokenCookie(response, request)
    if ((checkingToken === false) || checkingTokenCookie === false) {
      return response.status(400).send({
        message: 'error token'
      })
    }

    return response.status(201).send(data);
  })
}

exports.find = (request, response) => {
  Image.find(request.params.id, (error, dbResult) => {
    if (error !== null) {
      if (error.kind === 'not_found') {
        return response.status(404).send({
          message: `Not found image with id ${request.params.id}.`
        });
      }
      return response.status(500).send({
        message: `Error retrieving image with id ${request.params.id}`
      });
    }

    // Envoi de la réponse
    return response.status(200).send(dbResult);
  });
};

exports.update = (request, response) => {
  if (!request.body) {
    response.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  const { id } = request.params

  return Image.update(id, request.body, (error, data) => {
    if (error) {
      console.log(error)
      if (error.kind === 'not_found') {
        return response.status(404).send({
          message: `not found.`
        });
      }
      return response.status(500).send({
        message: `error server`
      });
    }

    const checkingToken = checkToken(request, response)
    const checkingTokenCookie = checkTokenCookie(response, request)
    if ((checkingToken === false) || checkingTokenCookie === false) {
      return response.status(400).send({
        message: 'error token'
      })
    }

    return response.status(200).send(data);
  });
};

exports.delete = (request, response) => {
  const { id } = request.params;
  Image.delete(id, (err, result) => {
    if (err !== null) {
      return response.status(err.status).send(err);
    }

    const checkingToken = checkToken(request, response)
    const checkingTokenCookie = checkTokenCookie(response, request)
    if ((checkingToken === false) || checkingTokenCookie === false) {
      return response.status(400).send({
        message: 'error token'
      })
    }

    return response.status(200).send(result);
  });
};