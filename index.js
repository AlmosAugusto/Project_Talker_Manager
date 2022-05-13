const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const crypto = require('crypto');
const autorizationEmail = require('./middlewares/autorizationEmail');
const autorizationPassword = require('./middlewares/autorizationPassword');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Task 1 - Crie o endpoint GET /talker

app.get('/talker', async (_request, response) => {
  const talker = await fs.readFile('./talker.json');
  return response.status(200).json(JSON.parse(talker));
});

// Task 2 - Crie o endpoint GET /talker/:id

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talker = await fs.readFile('./talker.json');

  const talkerId = JSON.parse(talker).find((t) => t.id === Number(id)); // ao usar o parseInt deu erro de lint então consultei esse site e me apresentou o NUMBER https://stackoverflow.com/questions/7818903/jslint-says-missing-radix-parameter;

  if (!talkerId) return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return response.status(200).json(talkerId);
});

// 3 - Crie o endpoint POST /login
// 4 - Adicione as validações para o endpoint /login
app.post('/login', autorizationEmail, autorizationPassword, (req, res) => {
  const autorizationToken = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token: autorizationToken }); 
});

app.listen(PORT, () => {
  console.log('Online');
});
