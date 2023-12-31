import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const search = document.getElementById('search');
const renderImages = document.getElementById('gallery');
let input = document.getElementById('search-form');
let perPage = 40;
let page = 1;
let loadmoreButton = document.querySelector('.load-more');

const totalPages = 500 / perPage;

loadmoreButton.style.display = 'none';

loadmoreButton.addEventListener('click', () => {
  if (page > totalPages) {
    return Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  getImages()
    .then(event => {
      fetchImages(event);
    })
    .catch(error => console.log(error));
});

async function getImages() {
  let key = '38505152-191c0f15af7e4e6ba82d13323';
  const input = document.getElementById('search-form').value;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    Notiflix.Notify.warning('Error: ' + error);
  }
}

async function fetchImages() {
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
      if (page === 1) {
        renderImages.innerHTML = markup;
      } else {
        renderImages.innerHTML += markup;
      }
      page += 1;
      const lightbox = new SimpleLightbox('.photo-card a');
      lightbox.on('show.simplelightbox');
      loadmoreButton.style.display = 'flex';
    }, 2200);
  } else {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
search.addEventListener('click', fetchImages);
