import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './index.js';

const search = document.getElementById('search');
const renderImages = document.getElementById('gallery');
let input = document.getElementById('search-form');
let loadmoreButton = document.querySelector('.load-more');

async function fetchImages(event) {
  event.preventDefault();
  if (input.value !== '') {
    let url = await getImages();
    Notiflix.Notify.success(`Hooray! We found ${url.data.totalHits} images.`);
    let markup = url.data.hits
      .map(
        value => `<div class="photo-card">
        <a href="${value.largeImageURL}"><img class="photo" src="${value.webformatURL}" alt="${value.tags}" loading="lazy" /></a>
        <div class="info">
        <p class="info-item">
        <b>Likes</b>
        <span class="info-number">${value.likes}</span>
        </p>
        <p class="info-item">
        <b>Views</b>
        <span class="info-number">${value.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span class="info-number">${value.comments}</span>
          </p>
        <p class="info-item">
        <b>Downloads</b>
        <span class="info-number">${value.downloads}</span>
        </p>
        </div>
        </div>`
      )
      .join(' ');
    setTimeout(() => {
      renderImages.innerHTML = markup;
      const lightbox = new SimpleLightbox('.photo-card a');
      lightbox.on('show.simplelightbox');
    }, 1200);
  } else {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
search.addEventListener('click', fetchImages);
