const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { URL } = require('url');

const BASE_URL = 'https://www.gotoon.net';
const BACK_UP_BASE_UR = 'https://kukudas.xyz';
const gotoonUrl = `${BASE_URL}/toon/하룻밤-아내`;
const gotoonScenesUrl = `${BASE_URL}/view/185382/하룻밤-아내-084`;

function fetchGotoons(url = BASE_URL) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        const kortoons = [];
        $('.toonMainWeeks .toonMainWeek ul li').each((index, element) => {
          const title =
            element.childNodes[1].childNodes[1].childNodes[1].attribs.alt;
          const thumbnailUrl =
            element.childNodes[1].childNodes[1].childNodes[1].attribs.src;
          const url = `${BASE_URL}${element.childNodes[1].attribs.href}`;

          const kortoon = {
            title: title,
            summary: '',
            url: url,
            thumbnailUrl: thumbnailUrl,
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

function fetchGotoon(url = gotoonUrl) {
  return new Promise((resolve, reject) => {
    fetch(new URL(url))
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        // FETCH KORTOON INFO
        const kortoonTitle = $('.toonInfo .title')[0].firstChild.data;
        const kortoonSummary = $('.toonInfo .description')[0].firstChild.data;
        const kortoonPhotoUrl = $('.toonInfo .preview .thumbnail')[0].firstChild
          .attribs.src;

        const episodeTable = $('.toonEpisodeList a');
        const episodesCount = episodeTable.length;
        let episodes = [];
        episodeTable.each((index, element) => {
          const episode = {
            title: element.childNodes[3].childNodes[0].data,
            url: `${BASE_URL}${element.attribs.href}`,
            episodeIndex: episodesCount - index
          };
          episodes.push(episode);
        });

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

function fetchGotoonScenes(url = gotoonScenesUrl) {
  return new Promise((resolve, reject) => {
    fetch(new URL(url))
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        const scenes = [];
        $('.contents img').each((index, image) => {
          scenes.push({
            src: image.attribs.src,
            alt: image.attribs.alt
          });
        });
        resolve(scenes);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { fetchGotoons, fetchGotoon, fetchGotoonScenes };
