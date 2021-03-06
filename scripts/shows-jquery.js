var SHOWS_API_KEY = apiConfig.SHOWS_API_KEY;

//=============RENDER AND LOAD SHOWS DATA=============//

// Global variable array to hold all show data
const showsArray = [];

// Function to create show information in the DOM
function createShowsElement(showsArray) {
  // CREATE A SHOW DATES BODY CONTAINER
  let $showsContainerItem = $("<tr>")
    .addClass("shows-container-item")
    .appendTo('tbody');

  // Date
  $("<td>")
    .addClass("shows-container-item__date")
    .text(showsArray.date)
    .appendTo($showsContainerItem);

  // Place
  $("<td>")
    .addClass("shows-container-item__place")
    .text(showsArray.place)
    // append the new element to parent
    .appendTo($showsContainerItem);
  
  // Location
  $("<td>")
    .addClass("shows-container-item__location")
    .text(showsArray.location)
    .appendTo($showsContainerItem);
    
  // Button Cell
  $("<td>")
    .addClass("shows-container-item__btn-cell")
    .append(
        // Button
        $("<button>")
        .addClass("shows-container-item__btn")
        .text("GET TICKETS")
      )
      .appendTo($showsContainerItem)

  return $showsContainerItem;
}

// Function to sort shows dates
function sortDates(jsonData) {
  jsonData.sort(function(a, b){
    return new Date(b.date) - new Date(a.date);
  });
}

//  Function to fetch show data and put in DOM
function renderNewShows(showsArray) {
  for(let i = 0; i < showsArray.length; i++) {
    let $showsContentWrapper = $(".shows-content-wrapper")
    
    // call the createShowsElement function
    let $showsContainerItem = createShowsElement(showsArray[i]);
    $showsContentWrapper.prepend($showsContainerItem);
  }
}

//=============HTTP REQUESTS=============//

// GET /showdates GET request to fetch comments from API
function loadShows() {
  let url = `https://project-1-api.herokuapp.com/showdates?api_key=${SHOWS_API_KEY}`
  fetch(url)
    .then(response => response.json())
    .then(jsonData => {
      sortDates(jsonData);
      renderNewShows(jsonData);
  })
  .catch(error => {
    throw Error (error.statusText);
  })
}

loadShows();

$(document).ready(function () {
  loadShows();
});