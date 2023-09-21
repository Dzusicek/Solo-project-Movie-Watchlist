const resultsContainer = document.getElementById("search-results-container");
let html = `<div class="film-container">
<img src="movie.img" alt="Movie image not availiable">
<h3>Movie title ⭐</h3>
</div>
`;

var docWidth = document.documentElement.offsetWidth;

[].forEach.call(document.querySelectorAll("*"), function (el) {
  if (el.offsetWidth > docWidth) {
    console.log(el);
  }
});
