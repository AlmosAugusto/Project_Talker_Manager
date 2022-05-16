const { INVALID } = require('../statusCode');

const talkMiddleware = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || talk.rate === undefined || !talk.watchedAt) { // colocando apenas o !talk.rate estava pegando o "rate:0"
    return res.status(INVALID).json(
      { message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' },
);
   }
  return next();
};

module.exports = talkMiddleware;