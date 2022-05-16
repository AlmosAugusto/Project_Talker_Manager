const { INVALID } = require('../statusCode');

const ageMiddleware = (req, res, next) => {
  const { age } = req.body;

  if (!age) return res.status(INVALID).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(INVALID).json({ message: 'A pessoa palestrante deve ser maior de idade' });
   }
  return next();
};

module.exports = ageMiddleware;