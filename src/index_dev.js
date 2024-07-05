// src/index_dev.js


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

    renderNews(lastNews);

  } catch (err) {
    console.error('Error fetching news:', err);
  }
}

function renderNews(newsItems) {
  const newsContainer = document.createElement('div');
  newsContainer.className = 'news-container';

  newsItems.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    const titleElement = document.createElement('h3');
    titleElement.textContent = news.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = `by ${news.author}`;

    const dateElement = document.createElement('p');
    const formattedDate = news.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = news.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    dateElement.textContent = `on ${formattedDate} at ${formattedTime}`;

    const urlElement = document.createElement('a');
    urlElement.href = news.url;
    urlElement.textContent = 'Read more';
    urlElement.target = '_blank';
    urlElement.rel = 'noopener noreferrer';

    newsItem.appendChild(titleElement);
    newsItem.appendChild(authorElement);
    newsItem.appendChild(dateElement);
    newsItem.appendChild(urlElement);

    newsContainer.appendChild(newsItem);
  });

  document.body.appendChild(newsContainer);
}

getNews();
