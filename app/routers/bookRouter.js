const express = require('express');
const router = express.Router();

const { bookController } = require('../controllers');
const { auth, adminAuth } = require('../middleware');

router.get('/', auth, bookController.getAllBooks);
router.get('/:isbn', auth, bookController.getByIsbnBook);

router.post('/', [auth, adminAuth], bookController.addBook);
router.put('/:isbn', [auth, adminAuth], bookController.updateBook);
router.delete('/:isbn', [auth, adminAuth], bookController.deleteBook);

module.exports = router;