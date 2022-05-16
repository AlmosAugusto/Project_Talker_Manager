const { INVALID } = require('../statusCode');

const rateMiddleware = (req, res, next) => {
  const { talk: { rate } } = req.body;
  
  if (rate < 1 || rate > 5) {
    return res.status(INVALID).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  return next();
};

module.exports = rateMiddleware;