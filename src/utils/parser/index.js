const {
  fetchToonkors,
  fetchToonkor,
  fetchToonkorScenes
} = require('./toonkor');
const {
  fetchCointoons,
  fetchCointoon,
  fetchCointoonScenes
} = require('./cointoon');
const { fetchGotoons, fetchGotoon, fetchGotoonScenes } = require('./gotoon');

const parserNames = ['Toonkor', 'Cointoon', 'Gotoon'];

module.exports = {
  fetchToonkors,
  fetchToonkor,
  fetchToonkorScenes,

  fetchCointoons,
  fetchCointoon,
  fetchCointoonScenes,

  fetchGotoons,
  fetchGotoon,
  fetchGotoonScenes,

  parserNames
};
