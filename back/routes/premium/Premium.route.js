const express = require('express')
const Premium = require('../../controllers/premium/Premium.controller')

const router = express.Router()

router.get('/find/:pronostiqueur', Premium.find)

router.get('/telegram/:pronostiqueurId', Premium.findtelegram)

router.post('/create', Premium.create)

router.put('/update/:userId', Premium.update)

module.exports = router