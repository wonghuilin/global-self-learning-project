// relay the error message in 500.html
const queryString = window.location.search;
const gameUrlParams = new URLSearchParams(queryString);
const error = gameUrlParams.get("error");
console.log(error);
console.log(document.getElementsByClassName("alert")[0]);
document.getElementsByClassName("alert")[0].textContent = error;
