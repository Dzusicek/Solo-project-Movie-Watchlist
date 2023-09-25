//links to html objects
const resultsContainer = document.getElementById("search-results-container");
const watchlistContainer = document.getElementById("watchlist-container");
const searchInput = document.getElementById("search-input-el");
const searchBtn = document.getElementById("search-btn-el");

//global variables
let searchResultsArray;
let watchlistArray = JSON.parse(localStorage.getItem("Watchlist"));

//event listeners
searchBtn.addEventListener("click", () => {
  if (searchInput.value) {
    resultsContainer.innerHTML = "";
    searchTitles(searchInput.value);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.id) {
    addToWatchlist(e.target.id);
  }
});

//fetch requests
async function searchTitles(searchData) {
  searchResultsArray = [];
  //returns short data array of films found in search
  const response = await fetch(
    `http://www.omdbapi.com/?s=${searchData}&?type=movie&apikey=284f2e6d`
  );
  const data = await response.json();
  //individualy searches first 4 movies for detailed information and than passes it on
  for (let i = 0; i < 3 /*data.Search.length*/; i++) {
    const searchTitle = await fetch(
      `http://www.omdbapi.com/?t=${data.Search[i].Title}&apikey=284f2e6d`
    );
    const response = await searchTitle.json();
    searchResultsArray.push(response);
  }
  resultsContainer.innerHTML += createHtml(searchResultsArray);
}

//creates html and combines it with data input from APIs and then renders it in index.html
function createHtml(dataArray) {
  for (const result of dataArray) {
    console.log("run");
    return `<div class="film-container">
    <img class="film-poster" src="${result.Poster}" />
                <div>
              <div class="film-title-container">
                <h3>${result.Title}</h3>
                <img src="./imgs/Star_rating_icon.png" />
                <h3>${result.imdbRating}</h3>
              </div>
              <div class="film-details">
                <p>${result.Runtime}</p>
                <p>${result.Genre}</p>
                <button type="button" id="${result.imdbID}" class="watchlist-btn-container">
                  <img src="./imgs/Add_to_watchlist_icon.png" />
                  Watchlist
                  </button>
              </div>
              <div class="film-description-container">
                <p>
                ${result.Plot}
                </p>
              </div>
            </div>
          </div>
    `;
  }
}

function addToWatchlist(targetId) {
  //variable providing information if item is already in watchlist
  const contained = watchlistArray.every((listItem) => {
    return listItem.imdbID !== targetId;
  });
  for (result of searchResultsArray) {
    if (targetId === result.imdbID && contained) {
      watchlistArray.push(result);
      localStorage.setItem("Watchlist", JSON.stringify(watchlistArray));
    }
  }
}
