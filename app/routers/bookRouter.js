const express = require('express')
const router = express.Router()

const { bookController } = require('../controllers')

router.get('/', bookController.getAllBooks)
router.get('/:id', bookController.getByIdBook)
router.post('/', bookController.addBook)
router.put('/:id', bookController.updateBook)
router.delete('/:id', bookController.deleteBook)

module.exports = router