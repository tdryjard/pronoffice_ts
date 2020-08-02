const Premium = require('../../models/premium/Premium.model')
const checkToken = require('../../middlewares/webToken/checkToken')
const checkTokenCookie = require('../../middlewares/webToken/checkTokenCookie')

exports.create = (request, response) => {

    const {
        user_id,
        pronostiqueur
    } = request.body;

    // Creer un utilisateur
    const premium = new Premium({
        user_id: user_id || null,
        pronostiqueur : pronostiqueur || null
    });

    if (!request.body) {
        return response.status(400).send({
            message: 'Content can not be empty!'
        });
    }

    return Premium.create(premium, (error, data) => {
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

exports.update = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: 'Content can not be empty!'
        });
    }

    const { userId } = request.params

    return Premium.update(userId, request.body, (error, data) => {
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

exports.find = (request, response) => {
    Premium.find(request.params.pronostiqueur, (error, dbResult) => {
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

exports.findtelegram = (request, response) => {
    Premium.findTelegram(request.params.pronostiqueurId, (error, dbResult) => {
        console.log(error)
        if (error !== null) {
            console.log(error)
            if (error.kind === 'not_found') {
                return response.status(404).send({
                    message: `Not found image with id ${request.params.pronostiqueurId}.`
                });
            }
            return response.status(500).send({
                message: `Error retrieving image with id ${request.params.pronostiqueurId}`
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
  
    const { userId } = request.params
  
    if (request.body.key_reset) {
      request.body.key_reset = bcrypt.hashSync(request.body.key_reset, 10);
    }
    else {
      const checkingToken = checkToken(request, response)
      const checkingTokenCookie = checkTokenCookie(response, request)
      if ((checkingToken === false) || checkingTokenCookie === false) {
        return response.status(400).send({
          message: 'error token'
        })
      }
    }
  
    return Premium.update(userId, request.body, (error, data) => {
      if (error) {
        if (error.kind === 'not_found') {
          return response.status(404).send({
            message: `pas trouvé de user ${contactId}. veuillez nous contacter`
          });
        }
        return response.status(500).send({
          message: `Problème connexion à la base de donnée, veuillez nous contacter en cas de problèmes`
        });
      }
  
      return response.status(200).send(request.body);
    });
  };