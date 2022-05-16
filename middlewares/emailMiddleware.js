const { INVALID } = require('../statusCode');

const emailMiddleware = (req, res, next) => {
  const { email } = req.body;

  if (!email) return res.status(INVALID).json({ message: 'O campo "email" é obrigatório' });
  if (!email.includes('@' && '.com')) { 
    return res.status(INVALID).json({ message: 'O "email" deve ter o formato "email@email.com"' });
   }
  return next();
};

module.exports = emailMiddleware;