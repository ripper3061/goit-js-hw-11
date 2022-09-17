import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import './sass/_common.scss';
import './sass/_search.scss';

const API_KEY = '29990970-06612ee6e4c4cb458b77f15de';
const BASE_URL = 'https://pixabay.com/api/';

const fetchArticles = (inputValue, page, perPage) => {
  const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${inputValue}&page=${page}&${perPage}&lang=uk,ru&key=${API_KEY}`;
  return axios.get(url);
};

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const searchBtn = document.querySelector('.search-btn');
const loadMoreBtn = document.querySelector('.load-more');
const perPage = 40;
let page = 1;
let searchQuery = '';
let simpleGalery = new SimpleLightbox('.gallery .gallery-link');

const renderMarkup = arr => {
  const markup = arr
    .map(image => {
      return `<div class="photo-card">
                    <a class="gallery-link" href="${image.largeImageURL}">
                        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class="gallery-image"/>
                    </a>
                    <div class="info">
                        <p class="info-item"><b>Likes</b>${image.likes}</p>
                        <p class="info-item"><b>Views</b>${image.views}</p>
                        <p class="info-item"><b>Comments</b>${image.comments}</p>
                        <p class="info-item"><b>Downloads</b>${image.downloads}</p>
                    </div>
                </div>`;
    })
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
};

const changePage = hits => {
  renderMarkup(hits);
  simpleGalery.refresh();
  page += 1;
};

const searchPhoto = async event => {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  page = 1;
  galleryList.innerHTML = '';
  if (searchQuery === '') {
    Notify.failure('Please enter something');
    return;
  }

  try {
    const { data } = await fetchArticles(searchQuery, page, perPage);
    if (!data.totalHits) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    changePage(data.hits);
    loadMoreBtn.classList.toggle('is-hidden');
  } catch (error) {
    console.error(error);
    console.log(error);
  }
};

const loadMoreContent = async () => {
  try {
    const { data } = await fetchArticles(searchQuery, page, perPage);
    const PAGES = data.totalHits / perPage;
    if (page >= PAGES) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.toggle('is-hidden');
    }
    changePage(data.hits);
  } catch (error) {
    console.log(error);
  }
};

searchForm.addEventListener('submit', searchPhoto);
loadMoreBtn.addEventListener('click', loadMoreContent);
