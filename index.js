const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// Linhas altaradas
const crypto = require('crypto');
const { SUCESS, NOT_FOUND, CREATED, DELETE } = require('./statusCode');
const authMiddleware = require('./middlewares/authMiddleware');
const emailMiddleware = require('./middlewares/emailMiddleware');
const ageMiddleware = require('./middlewares/ageMiddleware');
const passwordMiddleware = require('./middlewares/passwordMiddleware');
const nameMiddleware = require('./middlewares/nameMiddleware');
const rateMiddleware = require('./middlewares/rateMiddleware');
const talkMiddleware = require('./middlewares/talkMiddleware');
const watchedAtMiddleware = require('./middlewares/watchedAtMiddleware');

const talkerJson = ('./talker.json');// lint não permitiu ter essa const + de 6 vezes.

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Task 1 - Crie o endpoint GET /talker

app.get('/talker', async (_request, response) => {
  const talker = await fs.readFile(talkerJson);
  return response.status(SUCESS).json(JSON.parse(talker));
});

// Subi o requisito 8 para a linha 38, pois lá embaixo estava dando conflito
// 8 - Crie o endpoint GET /talker/search?q=searchTerm 
app.get('/talker/search',
authMiddleware,
 async (req, res, _next) => {
  const { q } = req.query;
  if (!q) return res.status(SUCESS).end([]);

  const talker = await fs.readFile(talkerJson, 'utf-8');
  const talkerParse = JSON.parse(talker);
  const talkerFilter = talkerParse.filter((t) => t.name.includes(q));

  return res.status(SUCESS).json(talkerFilter); 
});

// Task 2 - Crie o endpoint GET /talker/:id

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talker = await fs.readFile(talkerJson, 'utf-8');
  const talkerId = JSON.parse(talker).find((item) => item.id === Number(id)); // ao usar o parseInt deu erro de lint então consultei esse site e me apresentou o NUMBER https://stackoverflow.com/questions/7818903/jslint-says-missing-radix-parameter;

  if (!talkerId) { 
    return response.status(NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' }); 
}
  return response.status(SUCESS).json(talkerId);
});

// 3 - Crie o endpoint POST /login
// 4 - Adicione as validações para o endpoint /login
app.post('/login', emailMiddleware, passwordMiddleware, (_req, res, _next) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(SUCESS).json({ token }); 
});

// 5 - Crie o endpoint POST /talker
app.post('/talker', 
authMiddleware, 
nameMiddleware, 
ageMiddleware, 
talkMiddleware, 
rateMiddleware, 
watchedAtMiddleware, 
async (req, res, _next) => {
const { name, age, talk: { watchedAt, rate } } = req.body;

const talker = await fs.readFile(talkerJson, 'utf-8');
const talkParse = JSON.parse(talker);
const addTalker = { id: 5, name, age, talk: { watchedAt, rate } };
talkParse.push(addTalker);
fs.writeFile(talkerJson, JSON.stringify(talkParse));

  return res.status(CREATED).json(addTalker);
});

// 6 - Crie o endpoint PUT /talker/:id
app.put('/talker/:id', 
authMiddleware, 
nameMiddleware, 
ageMiddleware, 
talkMiddleware, 
watchedAtMiddleware, 
rateMiddleware, 
async (req, res, _next) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;

const talker = await fs.readFile(talkerJson, 'utf-8');

const talkerParse = JSON.parse(talker);
const talkerIndex = talkerParse.findIndex((i) => i.id === Number(id));
if (talkerIndex === -1) return res.status(NOT_FOUND).json({ message: 'Palestrante não existe' });

const talkerUpdate = { ...talkerParse[talkerIndex], name, age, talk: { watchedAt, rate } };
talkerParse[talkerIndex] = talkerUpdate;

fs.writeFile(talkerJson, JSON.stringify(talkerParse));

  return res.status(SUCESS).json(talkerUpdate); 
});

// 7 - Crie o endpoint DELETE /talker/:id
app.delete('/talker/:id',
authMiddleware, 
async (req, res, _next) => {
  const { id } = req.params;

const talker = await fs.readFile(talkerJson, 'utf-8');

const talkerParse = JSON.parse(talker);
const talkerIndex = talkerParse.findIndex((i) => i.id === Number(id));
if (talkerIndex === -1) return res.status(NOT_FOUND).json({ message: 'Palestrante não existe' });

talkerParse.splice(talkerIndex, 1); // Conteúdo do course 22.4 - "Atualizando e Deletando objetos através da API"

fs.writeFile(talkerJson, JSON.stringify(talkerParse));

  return res.status(DELETE).end(); 
});

app.listen(PORT, () => {
  console.log('Online');
});
