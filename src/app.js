const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

function validateUuid(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid project Id.'});
  }

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  //repositoryWithId = repositories.map((repository) => repository.id = uuid());
  
  return response.json(repositories);
});

app.post("/repositories", async(request, response) => {

  const { title, url, techs } = request.body; 

  let repository = {       
     id: uuid(),
     title,
     url,
     techs,
     likes: 0,
  }

  repositories.push(repository);
  
  return await response.json(repository);
});

app.put("/repositories/:id", validateUuid, (request, response) => {

  const { id } = request.params;  

  const { title, url, techs, likes } = request.body;

  let repositoryIndex = repositories.find(repository => repository.id == id);

  if (repositoryIndex < 0) {

      return response.status(400).json({ error: 'Repository not found'});
  }
  
  
  repositoryIndex = {
    id,
    title,
    url,
    techs,
    likes: repositoryIndex.likes,
  }

  return response.json(repositoryIndex);

});

app.delete("/repositories/:id", validateUuid, (request, response) => {  

  const { id } = request.params;

  let repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return res.status(400).json({ error: 'Repository not found'});
  }  

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateUuid, (request, response) => {

  const { id } = request.params;

  let repositoryIndex = repositories.find(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return res.status(400).json({ error: 'Project not found'});
  }

  console.log(repositoryIndex);
  repositoryIndex.likes++;

  return response.json(repositoryIndex);

});

module.exports = app;
