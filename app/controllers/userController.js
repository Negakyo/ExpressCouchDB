const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { userModel } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});

const signup = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await userModel.signup(value);

    const token = jwt.sign({ username: value.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User crée',
      token
    });
  } catch (error) {
    if (error.message.includes('existe déja')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await userModel.login(value.username, value.password);
    if (!user) {
      return res.status(401).json({ error: 'Mauvais identifiants' });
    }

    const token = jwt.sign({ username: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: 'Connexion reussie', user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };