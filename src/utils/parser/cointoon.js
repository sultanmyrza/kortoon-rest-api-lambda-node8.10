const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { URL } = require('url');

const BASE_URL = 'https://cointoon.net';
const cointoonUrl = `${BASE_URL}/comic/435/오렌지+마말레이드`;
const cointoonScenesUrl = `${BASE_URL}/comic_view/24105/오렌지+마말레이드+1화+-+만남`;

function fetchCointoons(url = BASE_URL) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        const kortoons = [];
        $('.week_box').each(function(index, element) {
          let a = element.childNodes[5];
          let img = a.childNodes[1];
          const kortoon = {
            title: img.attribs.alt,
            summary: '',
            url: decodeURIComponent(a.attribs.href),
            thumbnailUrl: img.attribs.src,
            photoUrl: ''
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

function fetchCointoon(url = cointoonUrl) {
  return new Promise((resolve, reject) => {
    fetch(new URL(url))
      .then(response => response.text())
      .then(async body => {
        const $ = cheerio.load(body);

        // FETCH KORTOON INFO
        const kortoonPhotoUrl = $('.toon_home')[0].children[1].attribs.src;
        const kortoonTitle = $('.toon_home')[0].children[1].attribs.alt;
        const kortoonSummary = $('.toon_font p')[0].children[0].data;

        // FETCH KORTOON EPISODES
        const episodeTable = $('.toon_tlist li a');
        const episodesCount = episodeTable.length;
        const episodes = [];
        episodeTable.each((index, element) => {
          const episode = {
            title: element.firstChild.data,
            url: decodeURIComponent(element.attribs.href),
            episodeIndex: episodesCount - index
          };
          episodes.push(episode);
        });
        // COLLECT DATA IN 1 OBJECT
        const kortoon = {
          title: kortoonTitle,
          summary: kortoonSummary,
          photoUrl: kortoonPhotoUrl,
          episodes: episodes,
          episodesCount: episodesCount
        };

        resolve(kortoon);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function fetchCointoonScenes(url = cointoonScenesUrl) {
  return new Promise((resolve, reject) => {
    fetch(new URL(url))
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        const imageElements = $('.view_img img');
        const scenes = [];
        imageElements.each((index, element) => {
          const image = {
            src: element.attribs.src,
            alt: element.attribs.alt
          };
          scenes.push(image);
        });
        resolve(scenes);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { fetchCointoons, fetchCointoon, fetchCointoonScenes };
