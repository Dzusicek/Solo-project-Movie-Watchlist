//links to html objects
const resultsContainer = document.getElementById("search-results-container");
const watchlistContainer = document.getElementById("watchlist-container");
const inputDivContainer = document.getElementById("input-area");
const searchInput = document.getElementById("search-input-el");
const searchBtn = document.getElementById("search-btn-el");
const watchlistPageLink = document.getElementById("watchlistPageLink");
//global variables
let searchResultsArray = [];
let watchlistArray = JSON.parse(localStorage.getItem("Watchlist"));
let currentLocation = document.URL;

//event listeners
document.addEventListener("click", (e) => {
  if (currentLocation.includes("index")) {
    manageClick(e, searchResultsArray);
  } else if (currentLocation.includes("watchlist")) {
    manageClick(e, watchlistArray);
  }
});

function manageClick(e, array) {
  if (e.target.id === searchBtn.id) {
    resultsContainer.innerHTML = "";
    searchTitles(searchInput.value);
  }
  if (e.target.id && !watchlistArray) {
    watchlistArray = [];
    addToWatchlist(e.target.id, array);
  } else if (e.target.id) {
    addToWatchlist(e.target.id, array);
  }
}

//fetch requests
async function searchTitles(searchData) {
  searchResultsArray = [];
  //returns short data array of films found in search
  const response = await fetch(
    `http://www.omdbapi.com/?s=${searchData}&?type=movie&apikey=284f2e6d`
  );
  const data = await response.json();
  //individualy searches first 4 movies for detailed information and than passes it on
  for (let i = 0; i < 4 /*data.Search.length*/; i++) {
    const searchTitle = await fetch(
      `http://www.omdbapi.com/?t=${data.Search[i].Title}&apikey=284f2e6d`
    );
    const response = await searchTitle.json();
    searchResultsArray.push(response);
  }
  renderFunction();
}

//creates html and combines it with data input from APIs and returns it
function createHtml(dataArray) {
  let generatedHtml = [];
  for (const result of dataArray) {
    generatedHtml.push(`<div class="film-container">
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
    `);
  }
  return generatedHtml;
}

function addToWatchlist(targetId, filteredArray) {
  console.log("addToWatchlist has run");
  //variable providing information if item is already in watchlist
  let notContained = watchlistArray.every((listItem) => {
    return listItem.imdbID !== targetId;
  });
  for (item of filteredArray) {
    console.log("for in watschlist ha run");
    if (targetId === item.imdbID && notContained) {
      watchlistArray.push(item);
    } else if (targetId === item.imdbID && !notContained) {
      const result = watchlistArray.find(({ imdbID }) => imdbID === targetId);
      watchlistArray.splice(watchlistArray.indexOf(item), 1);
    }
    localStorage.setItem("Watchlist", JSON.stringify(watchlistArray));
    console.log(watchlistArray);
  }
  renderFunction(watchlistArray);
}
function renderFunction() {
  console.log(searchResultsArray);
  if (watchlistContainer) {
    console.log("watchlist has run");
    watchlistContainer.innerHTML = createHtml(watchlistArray);
  } else {
    console.log("container has run");
    resultsContainer.innerHTML = createHtml(searchResultsArray);
  }
}
