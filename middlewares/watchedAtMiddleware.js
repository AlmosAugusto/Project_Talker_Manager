const { INVALID } = require('../statusCode');

const watchedAtMiddleware = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;

  const formatDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/; // Referencia https://www.guj.com.br/t/resolvido-como-validar-data-com-java-script/276656
  
  if (!formatDate.test(watchedAt)) {
 return res.status(INVALID).json(
    { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
);
  }
  return next();
};

module.exports = watchedAtMiddleware;