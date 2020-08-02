const express = require('express')
const Image = require('../../controllers/image/image.controller')

const router = express.Router()

router.post('/create', Image.create)

router.get('/find/:id', Image.find)

router.put('/update/:id', Image.update)

router.delete('/delete/:id', Image.delete)

module.exports = router