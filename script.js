const search = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

const endpoint =
  'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];

fetch(endpoint)
  .then((response) => response.json())
  .then((data) => cities.push(...data));

function findMatches(wordToMatch, cities) {
  return cities.filter((place) => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex);
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function displayCity(event) {
  let word = event.target.value;
  const data = findMatches(word, cities);
  const html = data
    .map((place) => {
      const regex = new RegExp(word, 'gi');
      const cityName = place.city.replace(
        regex,
        `<span class='hl'>${word}</span>`
      );
      const stateName = place.state.replace(
        regex,
        `<span class='hl'>${word}</span>`
      );

      return `<li>
    <span class='name'>${cityName}, ${stateName}</span>
    <span class = 'population'>${numberWithCommas(place.population)}</span>
    </li>`;
    })
    .join('');
  suggestions.innerHTML = html;
  if (!word) {
    suggestions.innerHTML = '';
  }
}

function debounce(func, delay = 400) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

search.addEventListener('keyup', debounce(displayCity));

// search.addEventListener('keyup', displayCity);

// function eventHandler() {
//   debounce(displayCity);
// }
