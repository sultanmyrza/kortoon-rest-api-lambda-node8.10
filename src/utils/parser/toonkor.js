const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { URL } = require('url');
const Base = require('./Base');

const BASE_URL = 'https://toonkor.life';
const toonkorUrl = `${BASE_URL}/수화`;
const toonkorScenesUrl = `${BASE_URL}/수화_2부_5화.html`;

function fetchToonkors(url = BASE_URL) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.text())
      .then(body => {
        let $ = cheerio.load(body);
        let kortoons = [];
        $('.section-item').each(function(index, element) {
          const thumbnailUrl = $(element)
            .find('img')
            .attr('src');
          const kortoon = {
            title: $(element).attr('alt'),
            summary: $(element)
              .find('.toon-summary')
              .text(),
            thumbnailUrl: thumbnailUrl,
            url: `${BASE_URL}${$(element)
              .find('a')
              .attr('href')}`
          };
          kortoons.push(kortoon);
        });
        resolve(kortoons);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function fetchToonkor(url = toonkorUrl) {
  return new Promise((resolve, reject) => {
    fetch(new URL(url))
      .then(res => res.text())
      .then(body => {
        let $ = cheerio.load(body);
        // FETCH KORTOON INFO
        const kortoonTitle = $('.bt_title').text();
        const kortoonSummary = $('.bt_over').text();
        const kortoonPhotoUrl = `${BASE_URL}${
          $('.bt_thumb img')[0].attribs.src
        }`;

        // FETCH KORTOON EPISODES
        let episodes = [];
        let episodesTable = $('#fboardlist').find('.tborder');
        let episodesCount = episodesTable.length;

        episodesTable.each(function(index, element) {
          let episode = {
            title: $(element)
              .find('.content__title')
              .attr('alt'),
            url: `${BASE_URL}${$(element)
              .find('.content__title')
              .attr('data-role')}`,
            episodeIndex: episodesCount - index
          };
          episodes.push(episode);
        });
        // COLLECT DATA INTO OBJ
        let kortoon = {
          title: kortoonTitle,
          summary: kortoonSummary,
          photoUrl: kortoonPhotoUrl,
          episodes: episodes.reverse(),
          episodesCount: episodesCount
        };
        resolve(kortoon);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function fetchToonkorScenes(url = toonkorScenesUrl) {
  return new Promise((resolve, reject) => {
    fetch(new URL(url))
      .then(res => res.text())
      .then(body => {
        let $ = cheerio.load(body);
        let scenes = [];

        // DECODING SCENES
        let toon_img = '';
        let regex = new RegExp("toon_img = '.+';");
        let searchResult = regex.exec(body);
        let code = searchResult[0];

        eval(code);
        toon_img = Base.decode(toon_img);

        $ = cheerio.load(toon_img);
        $('img').each(function(index, element) {
          let { alt, src } = element.attribs;
          if (!src.includes('https://')) {
            src = `${BASE_URL}${src}`;
          }
          let scene = {
            alt: alt,
            src: src
          };
          scenes.push(scene);
        });
        resolve(scenes);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { fetchToonkors, fetchToonkor, fetchToonkorScenes };
