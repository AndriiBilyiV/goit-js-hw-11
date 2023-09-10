import axios from "axios";
import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();
const scrollEffect = "data-aos='fade-in' data-aos-duration='1500'"
const modal = new SimpleLightbox(".gallery a", {})

const options = {
    params: {
        key: "39292728-1eb1db6d28a9fb64c22d19118",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: "40",
    }
}

const pix = 'https://pixabay.com/api/';
const gallery = document.querySelector('.gallery-js')
const input = document.querySelector('.input-js');
const btn = document.querySelector('.btn-js');
const viewportEnd = document.querySelector('.scroll-point-js')

let totalHits = 0;
let page = 1;

const scrollOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1
};


btn.addEventListener('click', evt => search(evt, input.value))

// First search onClickButton

async function search(listenerEvent, value) {
  listenerEvent.preventDefault();
  page = 1;
  options.params.q = value;
  options.params.page = 1;
  await axios.get(pix, options)
    .then(resp => {
      gallery.innerHTML = '';
      window.scrollBy({ top: 0, behavior: "smooth", });
      totalHits = resp.data.totalHits;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      renderCards(gallery, resp.data)
    })
    .catch(err => Notiflix.Notify.failure(err.message))
  modal.refresh();
  scrollDown();
  const listener = new IntersectionObserver(onScrollEnd, scrollOptions)
  listener.observe(viewportEnd)
}

// Load more by indefinitely scroll


async function onScrollEnd(ent, obs) {
  if (ent[0].intersectionRatio > 0) {
    page += 1;
      options.params.page = page;
      if (gallery.childElementCount >= totalHits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return
      }
      await axios.get(pix, options)
        .then(resp => 
          renderCards(gallery, resp.data))
        .catch(err => Notiflix.Notify.failure(err.message))
  modal.refresh();}
}




// Element render functions

function renderCards(elm, data) {
  if (!data.hits.length) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    return
  }
    
    let galleryContent = '';
    data.hits.forEach(card => {
        galleryContent += fillCard(card)
    })
  elm.insertAdjacentHTML('beforeend', galleryContent)
 
}

function fillCard({webformatURL, tags, likes, views, comments, downloads, largeImageURL}) {
  return `<a href="${largeImageURL}"><div class="photo-card" ${scrollEffect}>
    <div class="image-thumb">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" />
    </div>  
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}
    </p>
  </div>
</div></a>`
}

// Bonus-task auto-scroll

function scrollDown() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight,
  behavior: "smooth",
});
}


// Infinitely onEventScroll _backup

// async function scrollListener() {
//     const yPosition = window.scrollY;
//     const windowHight = window.screen.height;
//     const galleryHight = gallery.scrollHeight;
    
//     if (yPosition > (galleryHight - windowHight - 1000)) {
//       document.removeEventListener('scroll', scrollListener);
//       page += 1;
//       options.params.page = page;
//       if (gallery.childElementCount >= totalHits) {
//         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//         return
//       }
//       await axios.get(pix, options)
//         .then(resp => 
//           renderCards(gallery, resp.data))
//         .catch(err => Notiflix.Notify.failure(err.message))
//       modal.refresh();
//       document.addEventListener('scroll', scrollListener)
//     }
// }