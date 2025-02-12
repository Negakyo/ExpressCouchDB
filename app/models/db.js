const nano = require("nano");

const nanoInstance = nano(process.env.COUCHDB_URL);

const dbBook = nanoInstance.db.use("livres");
const dbUser = nanoInstance.db.use("users");

module.exports = { dbBook, dbUser };
