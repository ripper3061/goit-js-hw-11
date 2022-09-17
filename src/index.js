import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

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
let simpleGalery = new SimpleLightbox('.gallery a');
