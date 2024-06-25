const axios = require('axios');
const _ = require('lodash');

import "./style.css"


console.log('HACKER_NEWS_API_URL:', process.env.HACKER_NEWS_API_URL);






// Importa le immagini
import danGoldImg from './assets/images/dan-gold.jpg';
import alexandreDebieveImg from './assets/images/alexandre-debieve.jpg';
import arnoldFranciscaImg from './assets/images/arnold-francisca.jpg';
import antoineBeauvillainImg from './assets/images/antoine-beauvillain.jpg';
import alexKnightImg from './assets/images/alex-knight.jpg'
import antonPonomarevImg from './assets/images/anton-ponomarev.jpg'
import hansonLuImg from './assets/images/hanson-lu.jpg'
import lukeChesserImg from './assets/images/luke-chesser.jpg'
import nasaImg from './assets/images/nasa.jpg'
import thisisengineering1Img from './assets/images/thisisengineering1.jpg'
import thisisengineering2Img from './assets/images/thisisengineering2.jpg'
import thisisengineering3Img from './assets/images/thisisengineering3.jpg'

const page = document.body;

function createAndAppendElements(container, elements) {
  elements.forEach(element => {
    const el = document.createElement(element.type);
    if (element.id) el.id = element.id;
    if (element.className) el.className = element.className;
    if (element.textContent) el.textContent = element.textContent;
    if (element.src) el.src = element.src;
    container.appendChild(el);
    
    // If the element has children (for complex structures like headers with nested elements), call the function recursively
    if (element.children) {
      createAndAppendElements(el, element.children);
    }
  });
}

// Define the structure for header, main section, and footer
const sections = [
  {
    type: 'header',
    id: 'header',
    children: [
      { type: 'h1', id: 'title', textContent: 'TechFeed' },
      { type: 'p', id: 'description', textContent: 'Discover the latest in technology with TechFeed. From groundbreaking innovations to emerging trends, stay informed and inspired by the ever-evolving world of tech. Explore new products, insightful analysis, and captivating stories, all at your fingertips.' },
      //{ type: 'div', id: 'images-container' }
    ]
  },
  {
    type: 'div',
    id: 'images-container',
    children: [
      { type: 'img', id: 'img1', src: danGoldImg },
      { type: 'img', id: 'img2', src: alexandreDebieveImg },
      { type: 'img', id: 'img3', src: arnoldFranciscaImg },
      { type: 'img', id: 'img4', src: antoineBeauvillainImg }
    ]
  },
  {
    type: 'main',
    id: 'main-section'
  },
  {
    type: 'button',
    id: 'btn',
    textContent: 'Load More'
  },
  {
    type: 'footer',
    id: 'footer',
    textContent: 'Andrea Brandetti Frontend Developer'
  }
];

// Create and append the elements defined in the sections array
createAndAppendElements(page, sections);

const images = [
  danGoldImg, alexandreDebieveImg, arnoldFranciscaImg, antoineBeauvillainImg,
  alexKnightImg, antonPonomarevImg, hansonLuImg, lukeChesserImg,
  nasaImg, thisisengineering1Img, thisisengineering2Img, thisisengineering3Img
];

function getRandomImage(excludeImages) {
  let image;
  do {
    image = images[Math.floor(Math.random() * images.length)];
  } while (excludeImages.includes(image));
  return image;
}

function rotateImages() {
  const imageElements = document.querySelectorAll('#images-container img');
  const currentImages = Array.from(imageElements).map(img => img.src);

  imageElements.forEach(img => {
    const newImage = getRandomImage(currentImages);
    img.src = newImage;
    currentImages.push(newImage);  // Keep track of images already in use
  });
}

setInterval(rotateImages, 3000);

let moreNewsContainer; // Define this variable in the outer scope




async function getNews() {
  try {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/newstories.json`);
    const newsIds = response.data;

    const lastNewsIds = newsIds.slice(0, 20);
    const lastNewsPromises = lastNewsIds.map(id =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
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

    renderNews('Last News', 'last-news-container', lastNews.slice(0, 10));

    // Attacca l'event listener al pulsante solo dopo aver ottenuto i dati delle notizie
    const btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
      if (btn.textContent === 'Load More') {
        renderNews('More News', 'more-news-container', lastNews.slice(10, 20));
        btn.textContent = 'Load Less';
      } else {
        removeMoreNews();
        btn.textContent = 'Load More';
      }
    });
  } catch (err) {
    console.error('Error fetching news:', err);
  }
}

function renderNews(title, containerClass, newsItems) {
  const newsContainer = document.createElement('div');
  newsContainer.className = containerClass;
  const mainSection = document.getElementById('main-section');
  mainSection.appendChild(newsContainer);

  const subTitle = document.createElement('h2');
  subTitle.textContent = title;
  newsContainer.appendChild(subTitle);

  const newsUl = document.createElement('ul');
  newsContainer.appendChild(newsUl);

  newsItems.forEach(news => {
    const newsLi = document.createElement('li');
    const formattedDate = news.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = news.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    newsLi.innerHTML = `<h3>${news.title}</h3>
    <a href="${news.url}"><p>Read More</p></a>
    <p>by <strong>${news.author}</strong></p>
    <p>on ${formattedDate} at ${formattedTime}</p>`;
    newsUl.appendChild(newsLi);
  });

  if (containerClass === 'more-news-container') {
    moreNewsContainer = newsContainer;
  }
}

function removeMoreNews() {
  if (moreNewsContainer) {
    moreNewsContainer.remove();
  }
}

getNews();
