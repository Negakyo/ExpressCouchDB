const { dbUser } = require("./db");
const bcrypt = require('bcrypt');

const signup = async (userData) => {
  try {
    const { username, password, email } = userData;

    const query = {
      selector: { "_id": username },
    }
    const existingUser = await dbUser.find(query);
    if (existingUser.docs.length > 0) {
      throw new Error('Le nom d\'utilisateur existe déjà');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userDoc = {
      _id: username,
      email,
      password: hashedPassword,
      type: 'user'
    };

    const response = await dbUser.insert(userDoc);
    return response;
  } catch (error) {
    throw new Error("Erreur lors de l'inscription: " + error.message);
  }
};

const login = async (username, password) => {
  try {
    const query = {
      selector: { "_id": username },
    }
    const user = await dbUser.find(query);
    
    if (user.docs.length === 0) {
      return null;
    }

    const userDoc = user.docs[0];
    const isValid = await bcrypt.compare(password, userDoc.password);
    if (!isValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = userDoc;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Erreur lors de la connexion: " + error.message);
  }
};

module.exports = { signup, login };