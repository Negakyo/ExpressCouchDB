const Joi = require('joi');
const { bookModel } = require("../models");

const bookSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .required(),
  author: Joi.string()
    .min(3)
    .required(),
  publication_year: Joi.number()
    .integer()
    .min(1000)
    .max(9999)
    .required(),
  language: Joi.string()
    .valid('French', 'English', 'German', 'Spanish')
    .required(),
  summary: Joi.string()
    .min(10)
    .required(),
  isbn: Joi.string()
    .pattern(/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1,7}$/)
    .required(),
  page_count: Joi.number()
    .integer()
    .positive()
    .required(),
  publisher: Joi.string()
    .min(3)
    .required()
});


async function getAllBooks(req, res) {
  
  try {
    const response = await bookModel.getAll();

    if (!response || !response.docs || response.docs.length === 0) {
      return res.status(404).json({ error: "Aucun livres" });
    }

    res.status(200).json({ message: "Tous les livres", response })
  } catch (error) {
    res.json(error)
  }
}

async function getByIsbnBook(req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await bookModel.getByIsbn(isbn);
    
    if (!response || !response.docs || response.docs.length === 0) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    res.status(200).json({ message: "Livre spécifique", response: response.docs[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addBook(req, res) {
  const body = req.body;
  const { error, value } = bookSchema.validate(body);


  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const response = await bookModel.add(value);
    res.status(201).json({ message: "Livre ajouté avec succès", livre: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBook(req, res) {
  const isbn = req.params.isbn;
  const body = req.body;

  const { _id, _rev, ...cleanBody } = body;

  const { error, value } = bookSchema.validate(cleanBody);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const doc = await bookModel.getByIsbn(isbn);

    if (!doc || !doc.docs || doc.docs.length === 0) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    const book = doc.docs[0];

    const updatedBook = await bookModel.updateByIsbn(book._id, book._rev, isbn, value);

    res.status(200).json({ message: "Livre mis à jour avec succès", livre: updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteBook(req, res) {
  const isbn = req.params.isbn;

  try {
    const doc = await bookModel.getByIsbn(isbn);

    if (!doc || !doc.docs || doc.docs.length === 0) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    const book = doc.docs[0];

    await bookModel.deleteByIsbn(book._id, book._rev);

    res.status(200).json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllBooks, getByIsbnBook, addBook, updateBook, deleteBook };
