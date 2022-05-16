const { INVALID } = require('../statusCode');

const passwordMiddleware = (req, res, next) => {
  const { password } = req.body;

  if (!password) return res.status(INVALID).json({ message: 'O campo "password" é obrigatório' });
  if (!/^[0-9]{6,50}$/.test(password)) { 
    return res.status(INVALID).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
   }
  return next();
};

module.exports = passwordMiddleware;