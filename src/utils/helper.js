const { fetchToonkors, fetchCointoons, fetchGotoons } = require('./parser');

module.exports.getKortoonsHelper = function(provider) {
  return new Promise((resolve, reject) => {
    switch (provider) {
      case 'Toonkor':
        resolve(fetchToonkors());
        break;
      case 'Cointoon':
        resolve(fetchCointoons());
        break;
      case 'Gotoon':
        resolve(fetchGotoons());
        break;
      default:
        reject(new Error(`provider with name ${provider} does not exist`));
        break;
    }
  });
};
