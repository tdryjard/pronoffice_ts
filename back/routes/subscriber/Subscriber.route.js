const express = require('express')
const Subscriber = require('../../controllers/subscriber/subscriber.controller')

const router = express.Router()

router.post('/create', Subscriber.create)

module.exports = router