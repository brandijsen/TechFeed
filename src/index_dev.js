const axios = require('axios');
const _ = require('lodash');






async function getNews() {
try {
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

console.log('Last 10 news:', lastNews.slice(0, 10));
console.log('Other news:', lastNews.slice(10, 20));


// Attacca l'event listener al pulsante solo dopo aver ottenuto i dati delle notizie

} catch (err) {
console.error('Error fetching news:', err);
}
}




getNews();