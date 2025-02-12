const { dbBook } = require("./db");

const getAll = async () => {

  try {
    
    const response = await dbBook.find({
      selector: {},
    });

    return response;
  } catch (error) {
    return error;
  }
};

const getById = async (id) => {

  try {

    const query = {
      selector: { "_id": id },
    }

    const response = await dbBook.find(query);

    return response;
  } catch (error) {
    return error;
  }
};

const add = async (book) => {

  try {

    const response = await dbBook.insert(book);
    return response;
  } catch (error) {
    throw new Error("Erreur lors de l'ajout du livre: " + error.message);
  }
};

const updateById = async (id, rev, updatedBook) => {

  try {

    const response = await dbBook.insert({
      _id: id,
      _rev: rev,
      ...updatedBook,
    });
    return response;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du livre: " + error.message);
  }
};

const deleteById = async (id, rev) => {

  try {
    const response = await dbBook.destroy(id, rev);

    return response;
  } catch (error) {
    return error;
  }
};

module.exports = { getAll, getById, add, deleteById, updateById }
