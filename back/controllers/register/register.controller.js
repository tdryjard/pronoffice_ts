const bcrypt = require('bcrypt');
const User = require('../../models/register/register.model');
const verifyPassword = require('../../middlewares/formValidity/verifyPassword');
const regexList = require('../../utils/regexList');
const jwt = require('jsonwebtoken');
const checkToken = require('../../middlewares/webToken/checkToken')
const checkTokenCookie = require('../../middlewares/webToken/checkTokenCookie')

// Creer un nouvel utilisateur
exports.create = function createUser(request, response) {
  const {
    pseudo,
      password
  } = request.body;

  // Creer un utilisateur
  const user = new User({
    pseudo: pseudo || null,
    password: password || null
  });

  // Verification mot de passe
  const passwordErrorHandler = verifyPassword(password, 8, 25);
  if (passwordErrorHandler) {
    return response.status(400).send(passwordErrorHandler);
  }

  // Encryptage du mot de passe
  user.password = bcrypt.hashSync(user.password, 10);

  // Enregistre un utilisateur
  return User.create(user, (error, data) => {
    if (error) {
      console.log(error)
      return response.status(500).send({
        message: error.message || 'Some error occurred while creating the user.'
      });
    }
    console.log(data)
    email = data.pseudo
    console.log(email)
    // Envoi de la réponse en status 201 soit (Created)
    return response.status(201).send({
      alert: {
        type: 'success',
        text: 'Vous êtes inscrit.'
      },
      email
    });
  });
};




exports.connect = function userConnectToTheWebsite(request, response) {
  const { pseudo, password } = request.body;

  return User.connect(pseudo, (err, data) => {
    // Decryptage du mot de passe en base de données et verification d'une correspondance avec celui que l'utilisateur a rentrer

    if (password && data) {
      const samePassword = bcrypt.compareSync(password, data.password);
      if (!samePassword) return sendResponse(400);
    } else return response.status(400);

    if (err) {
      return response.status(400);
    }

    // Génération du jsonWebToken
    const token = jwt.sign({ id: data.id, exp: (Date.now() / 1000 + (60 * 60 * 120)) }, `${process.env.SECRET_KEY}`);
    let pseudo = data.pseudo || null
    let id = data.id || null

    return response.status(200).send({
      text: 'Vous êtes connecté.',
      id,
      pseudo,
      token,
      alertType: 'success'
    });
  });
};

exports.changeLog = function updateFirstLog(request, response) {

  let pass = request.body.password
  // Verification mot de passe
  const passwordErrorHandler = verifyPassword(pass, 8, 25);
  if (passwordErrorHandler) {
    return response.status(400).send(passwordErrorHandler);
  }

  // Encryptage du mot de passe
  let password = bcrypt.hashSync(pass, 10);
  request.body.password = password

  // Enregistre un utilisateur
  return User.changeLog(request.params.userId, request.body, (error, data) => {
    if (error) {
      console.log(error)
      return response.status(500).send({
        message: error.message || 'Some error occurred while creating the user.'
      });
    }
    
    // Envoi de la réponse en status 201 soit (Created)
    return response.status(201).send({
      alert: {
        type: 'success',
        text: 'Vous êtes inscrit.'
      },
      data
    });
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

  return User.update(userId, request.body, (error, data) => {
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

exports.find = (request, response) => {
  User.find(request.params.userId, (error, dbResult) => {
    if (error !== null) {
      if (error.kind === 'not_found') {
        return response.status(404).send({
          message: `Not found user with id ${request.params.userId}.`
        });
      }
      return response.status(500).send({
        message: `Error retrieving user with id ${request.params.userId}`
      });
    }

    const checkingToken = checkToken(request, response)
    const checkingTokenCookie = checkTokenCookie(response, request)
    if ((checkingToken === false) || checkingTokenCookie === false) {
      return response.status(400).send({
        message: 'error token'
      })
    }

    // Envoi de la réponse
    return response.status(200).send(dbResult);
  });
};


exports.compareKeyReset = function userConnectToTheWebsite(request, response) {
  const { key_reset, userId } = request.body;
  return User.compareKeyReset(userId, (err, data) => {
    // Decryptage du mot de passe en base de données et verification d'une correspondance avec celui que l'utilisateur a rentrer
    let nice = false
    const samePassword = bcrypt.compareSync(key_reset, data.key_reset);
    if (!samePassword) return response.status(400).send({
      message: `Error not good key`
    });
    else nice = true

    if (err) {
      return response.status(500).send({
        message: `Error server`
      });
    }

    if (nice === true) return response.status(200).send(data);
    else return response.status(400);
  });
};