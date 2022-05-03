const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Task 1 - Crie o endpoint GET /talker

app.get('/talker', async (_request, response) => {
  const talker = await fs.readFile('./talker.json');
  return response.status(200).json(JSON.parse(talker));
});

// Task 1 - Crie o endpoint GET /talker/:id

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talker = await fs.readFile('./talker.json');

  const talkerId = JSON.parse(talker).find((t) => t.id === parseInt(id));

  if (!talkerId) return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return response.status(200).json(talkerId);
});

app.listen(PORT, () => {
  console.log('Online');
});
