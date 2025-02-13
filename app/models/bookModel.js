const { dbBook } = require("./db");

const getAll = async () => {

  try {
    
    const response = await dbBook.find({
      selector: {}    });

    return response;
  } catch (error) {
    return error;
  }
};

const getByIsbn = async (isbn) => {
  try {
    const query = {
      selector: { "isbn": isbn }
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

const updateByIsbn = async (id, rev, isbn, updatedBook) => {
  try {

    const existingBook = await getByIsbn(isbn);
    if (!existingBook || !existingBook.docs || existingBook.docs.length === 0) {
      throw new Error("Le livre n'existe pas");
    }

    const currentBook = existingBook.docs[0];
    
    if (rev !== currentBook._rev) {
      throw new Error("Rev obsolete");
    }

    const { _id, _rev, ...cleanUpdatedBook } = updatedBook;

    const response = await dbBook.insert({
      _id: id,
      _rev: rev,
      ...currentBook,
      ...cleanUpdatedBook,
      isbn: isbn
    });
    return response;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du livre: " + error.message);
  }
};

const deleteByIsbn = async (id, rev) => {
  try {
    
    const response = await dbBook.destroy(id, rev);
    return response;
  } catch (error) {
    throw new Error("Erreur lors de la suppression du livre: " + error.message);
  }
};

module.exports = { getAll, getByIsbn, add, deleteByIsbn, updateByIsbn }
