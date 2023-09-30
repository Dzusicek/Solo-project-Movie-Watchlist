//links to html objects
const resultsContainer = document.getElementById("search-results-container");
const watchlistContainer = document.getElementById("watchlist-container");
const inputDivContainer = document.getElementById("input-area");
const searchInput = document.getElementById("search-input-el");
const searchBtn = document.getElementById("search-btn-el");
const watchlistPageLink = document.getElementById("watchlistPageLink");
//links to used images
let plusIcon = "./imgs/Add_to_watchlist_icon.png";
let minusIcon = "./imgs/Remove_from_watchlist_icon.png";

//onload functions
window.onload = function () {
  if (localStorage.getItem("Watchlist") === null) {
    localStorage.setItem("Watchlist", "[]");
    watchlistArray = JSON.parse(localStorage.getItem("Watchlist"));
  }
  renderFunction();
};

//global variables
let searchResultsArray = [];
let watchlistArray = JSON.parse(localStorage.getItem("Watchlist"));

//event listeners
document.addEventListener("click", (e) => {
  if (resultsContainer) {
    console.log("this");
    manageClick(e, searchResultsArray);
  } else if (watchlistContainer) {
    console.log("that");
    manageClick(e, watchlistArray);
  }
});

//decides what happennes when user clicks something
function manageClick(e, array) {
  if (e.target.id === searchBtn.id) {
    console.log("1");
    resultsContainer.innerHTML = "";
    searchTitles(searchInput.value);
  } else if (e.target.id.includes("tt") && !watchlistArray) {
    console.log("2");
    watchlistArray = [];
    addToWatchlist(e.target.id, array);
  } else if (e.target.id.includes("tt")) {
    console.log("3");
    addToWatchlist(e.target.id, array);
  }
}

//fetch requests
async function searchTitles(searchData) {
  searchResultsArray = [];
  //returns short data array of films found in search
  const response = await fetch(
    `https://www.omdbapi.com/?s=${searchData}&?type=movie&apikey=284f2e6d`
  );
  const data = await response.json();
  //individualy searches first 4 movies for detailed information and than passes it on
  for (let i = 0; i < 4 /*data.Search.length*/; i++) {
    const searchTitle = await fetch(
      `https://www.omdbapi.com/?t=${data.Search[i].Title}&apikey=284f2e6d`
    );
    const response = await searchTitle.json();
    searchResultsArray.push(response);
  }
  renderFunction();
}

//creates html and combines it with data input from APIs and returns it
function createHtml(dataArray, icon) {
  let generatedHtml = [];
  for (const result of dataArray) {
    if (watchlistArray.includes(result)) {
      icon = minusIcon;
    } else {
      icon = plusIcon;
    }
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
                  <img src="${icon}" id="${result.imdbID}btn">
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

//function filters and if needed pushes item in watchlist array
function addToWatchlist(targetId, filteredArray) {
  //variable providing information if item is already in watchlist
  console.log(watchlistArray);
  let notContained = watchlistArray.every((listItem) => {
    return listItem.imdbID !== targetId;
  });
  console.log(notContained);
  for (item of filteredArray) {
    if (targetId === item.imdbID && notContained) {
      watchlistArray.push(item);
      console.log("A");
    } else if (targetId === item.imdbID && !notContained) {
      watchlistArray.splice(watchlistArray.indexOf(item), 1);
      console.log("B");
    }
    localStorage.setItem("Watchlist", JSON.stringify(watchlistArray));
  }
  renderFunction();
}

//This function renders generated content based on what html elements exist
function renderFunction() {
  if (watchlistArray === null) {
    localStorage.setItem("Watchlist", "[]");
  } else if (watchlistContainer && watchlistArray.length) {
    watchlistContainer.innerHTML = createHtml(watchlistArray, minusIcon);
    inputDivContainer.style.display = "none";
  } else if (watchlistContainer && watchlistArray.length == 0) {
    watchlistContainer.innerHTML = `        <h2 id="placeholderImg">Your watchlist is looking a little empty...</h2>
        <a class="boldTextP" href="./index.html">
          <img src="./imgs/Add_to_watchlist_icon.png" /> Let’s add some movies!
        </a>`;
    inputDivContainer.style.display = "none";
  } else if (resultsContainer && searchResultsArray.length) {
    inputDivContainer.style.display = "visible";
    resultsContainer.innerHTML = createHtml(searchResultsArray, plusIcon);
  } else if (resultsContainer) {
    resultsContainer.innerHTML = `        <img
          id="placeholderImg"
          src="./imgs/Videotape_icon.png"
          alt="Viedotape-icon"
        />
        <h3>Start Exploring!</h3>`;
  }
}
