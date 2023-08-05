const API_KEY = 'api_key=b4b5f9d98442f11bbdd50a5adf70f1d1';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const language = 'language=pt-BR';

window.addEventListener('scroll', showNavOnScroll)
document.addEventListener("mouseup", hideSearch);

let home = document.querySelector("#home")
let popularCarousel = document.querySelector(".popular")
let movieContainer = document.querySelector(".movie")
let searchContainer = document.querySelector(".search-container")
let searchInput = document.querySelector("#search")
let moviesIds = []
let tvSeriesIds = []

async function getMovies(params) {
  console.log(params)

  try {
    let data = []

    for(let i = 1; i < 4; i++) {
      let response = await fetch(`${BASE_URL}movie/${params}?${API_KEY}&${language}&page=${i}`, {cors: "no-cors"})
      response = await response.json()
      data.push(...response.results) 
      
      response.results.forEach(movie => moviesIds.push(movie.id))
    } 
    
    return data
  } catch (e) {
    throw new Error(e.message)
  }
}

async function getTvSeries(params) {
  try {
    let data = []

    for(let i = 1; i < 4; i++) {
      let response = await fetch(`${BASE_URL}tv/${params}?${API_KEY}&${language}&page=${i}`, {cors: "no-cors"})
      response = await response.json()
      data.push(...response.results) 
      
      response.results.forEach(tvSerie => tvSeriesIds.push(tvSerie.id))
    } 
    
    return data
  } catch (e) {
    throw new Error(e.message)
  }
}

async function getMovie(id) {
  try {
    let response = await fetch(`${BASE_URL + "movie/" + id + "?" + API_KEY}&${language}`)
    let data = await response.json()

    return data
  } catch (e) {
    throw new Error(e.message)
  }

}

async function getTvSerie(id) {
  try {
    let response = await fetch(`${BASE_URL + "tv/" + id + "?" + API_KEY}&${language}`)
    let data = await response.json()

    return data
  } catch (e) {
    throw new Error(e.message)
  }

}

async function getRandomPoster() {
  let random = Math.floor(Math.random() * 30)
  let movieOrPoster = Math.floor(Math.random() * 5) > 2

  let element;

  if(movieOrPoster) {
    element = await getMovie(moviesIds[random])
    
    home.innerHTML = `
      <div class="poster-container">
        <div class="poster-infos">
          <h4>Filme</h4>
          <h1>${element.title}</h1>
          <p>${element.overview}</p>
        </div>
      </div>
      <img src=${IMG_URL + element.backdrop_path} alt="${element.title} poster" />
    `

    return;
  } 

  element = await getTvSerie(tvSeriesIds[random]) 
  
  home.innerHTML = `
  <div class="poster-container">
    <div class="poster-infos">
    <h4>Série</h4>
      <h1>${element.name}</h1>
      <p>${element.overview}</p>
    </div>
  </div>
  <img src=${IMG_URL + element.backdrop_path} alt="${element.name} poster" />
  `
}

async function getCarousel(params, is_tv = false) {
  let list = is_tv ? await getTvSeries(params): await getMovies(params)

  for(let item of list) {
    document.querySelector(`.${is_tv ? params + "_tv" : params}`).innerHTML += `<img src=${IMG_URL + item.poster_path} />
      <div class="informations-modal">
        <img src=${IMG_URL + item.backdrop_path} alt="${is_tv ? item.name : item.title}"/>
        <div>
          
        </div>
      </div>
    `
  }
}
  
function goLeft(className) {
  let carousel = document.querySelector(`.${className}`)
  carousel.scrollLeft -= carousel.offsetWidth - 500

  hideCarouselRightButton(carousel)
}

function goRight(className) {
  let carousel = document.querySelector(`.${className}`)
  carousel.scrollLeft += carousel.offsetWidth - 500

  hideCarouselRightButton(carousel)
}

function hideCarouselRightButton(carousel) {
  if(carousel.scrollLeft === 0) {
    carousel.previousElementSibling.style.display = "none"
    
    return;
  }


  carousel.previousElementSibling.style.display = "block"
}

function showSearch() {
  searchContainer.style.border = "1px solid white"
  searchInput.style.width = "25rem"
}

function hideSearch(e) {
    if (!searchContainer.contains(e.target)) {
      searchContainer.style.border = "none"
      searchInput.style.width = "0"
    }
}

function showNavOnScroll() {
  let navigation = document.querySelector("#navigation")

  if (scrollY > 0){
    navigation.classList.add('scroll')
  } else {
    navigation.classList.remove('scroll')
  }

}


async function callApiFunctions() {
  await getCarousel("popular")
  await getCarousel("top_rated")
  await getCarousel("upcoming")
  await getCarousel("popular", true)
  await getCarousel("top_rated", true)
  await getRandomPoster()
}

callApiFunctions()