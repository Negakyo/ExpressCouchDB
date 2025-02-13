const { dbBook } = require("./db");

const getAll = async () => {

  try {
    
    const response = await dbBook.find({
      selector: {},
      fields: ["title", "author", "publication_year", "language", "summary", "isbn", "page_count", "publisher"],
    });

    return response;
  } catch (error) {
    return error;
  }
};

const getByIsbn = async (isbn) => {
  try {
    const query = {
      selector: { "isbn": isbn },
      fields: ["title", "author", "publication_year", "language", "summary", "isbn", "page_count", "publisher"],
    }

    const response = await dbBook.find(query);
    return response;
  } catch (error) {
    return error;
  }
};

const add = async (book) => {
  try {

    const existingBook = await getByIsbn(book.isbn);
    if (existingBook && existingBook.docs && existingBook.docs.length > 0) {
      throw new Error('Un livre avec cet ISBN existe déjà');
    }

    book._id = book.isbn;
    const response = await dbBook.insert(book);
    return response;
  } catch (error) {
    if (error.message === 'Document update conflict.') {
      throw new Error('Un livre avec cet ISBN existe déjà');
    }
    throw new Error("Erreur lors de l'ajout du livre: " + error.message);
  }
};

const updateByIsbn = async (isbn, rev, updatedBook) => {

  try {
    if (updatedBook.isbn && updatedBook.isbn !== isbn) {
      throw new Error("L'ISBN dans le corps de la requête ne correspond pas à l'ISBN dans l'URL");
    }

    const response = await dbBook.insert({
      _id: isbn,
      _rev: rev,
      ...updatedBook,
      isbn: isbn
    });
    return response;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du livre: " + error.message);
  }
};

const deleteByIsbn = async (isbn, rev) => {
  try {
    const response = await dbBook.destroy(isbn, rev);
    return response;
  } catch (error) {
    throw new Error("Erreur lors de la suppression du livre: " + error.message);
  }
};

module.exports = { getAll, getByIsbn, add, deleteByIsbn, updateByIsbn }
