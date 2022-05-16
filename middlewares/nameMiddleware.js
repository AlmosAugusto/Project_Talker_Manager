const { INVALID } = require('../statusCode');

const nameMiddleware = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(INVALID).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(INVALID).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
   }
  return next();
};

module.exports = nameMiddleware;