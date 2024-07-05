// netlify/functions/lambda.js

exports.handler = async (event, context) => {
  try {
    const axios = require('axios');
    const _ = require('lodash');

    const response = await axios.get(process.env.HACKER_NEWS_API);
    const newsIds = response.data;

    const lastNewsIds = newsIds.slice(0, 20);
    const lastNewsPromises = lastNewsIds.map(id =>
      axios.get(`${process.env.HACKER_NEWS_API_ITEM}${id}.json`)
    );

    const lastNewsResponses = await Promise.all(lastNewsPromises);

    const lastNews = lastNewsResponses.map(res => {
      const title = _.get(res, 'data.title', 'Title not available');
      const url = _.get(res, 'data.url', 'URL not available');
      const author = _.get(res, 'data.by', 'Author not available');
      const date = new Date(_.get(res, 'data.time', 0) * 1000);
      return { title, url, author, date };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(lastNews),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news' }),
    };
  }
};
