const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' });
  }

  return next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = repositories[repoIndex];

  const updatedRepo = { ...repository, title, url, techs };

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repoIndex, 1);

  return response
    .status(204)
    .json({ success: 'Repository deleted succesfully' });
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = repositories[repoIndex];

  const likedRepository = { ...repository, likes: repository.likes + 1 };

  repositories[repoIndex] = likedRepository;

  return response.status(200).json(likedRepository);
});

module.exports = app;
