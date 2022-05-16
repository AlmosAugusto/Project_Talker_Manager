const { BAD_REQUEST } = require('../statusCode');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(BAD_REQUEST).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) { 
    return res.status(BAD_REQUEST).json({ message: 'Token inválido' }); 
}

  return next();
};

module.exports = authMiddleware;