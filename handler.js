require('dotenv').config({ path: './variables.env' });
import { getKortoonsHelper } from './src/utils/helper';

import kortoonParser from './src/utils/parser';

function responseSuccess(body) {
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
}

function responseError(error) {
  return {
    statusCode: error.statusCode || 500,
    headers: { 'Content-Type': 'plain/text' },
    body: JSON.stringify(error.message)
  };
}

export const getKortoons = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let provider = event.pathParameters.providerId;

  kortoonParser[`fetch${provider}s`]()
    .then(kortoons => {
      callback(null, responseSuccess(kortoons));
    })
    .catch(error => {
      callback(null, responseError(error));
    });
};

export const getKortoon = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let provider = event.pathParameters.providerId;
  let kortoonUrl = event.queryStringParameters.url;

  kortoonParser[`fetch${provider}`](kortoonUrl)
    .then(kortoon => callback(null, responseSuccess(kortoon)))
    .catch(error => callback(null, responseError(error)));
};

export const getEpisodeScenes = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let provider = event.pathParameters.providerId;
  let episodeUrl = event.queryStringParameters.episodeUrl;

  kortoonParser[`fetch${provider}Scenes`](episodeUrl)
    .then(scenes => callback(null, responseSuccess(scenes)))
    .catch(error => callback(null, responseError(error)));
};
