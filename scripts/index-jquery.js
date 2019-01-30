var COMMENTS_API_KEY = apiConfig.COMMENTS_API_KEY;

//=============RENDER AND LOAD POSTED TWEETS=============//

// Global variable array to hold all comments
const commentArray = [];

// Function to calculate timestamp
function postTime(timestamp) {
  let currentDate = Date.now(); // returns date now in ms
  let timeDiff = currentDate - timestamp;

  if (Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365)) > 0) {
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365)) + " years ago";

  } else if (Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30)) > 0) {
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30)) + " months ago";

  } else if (Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 24)) > 0) {
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + " days ago";

  } else if (Math.floor(timeDiff / (1000 * 60 * 60)) > 0) {
    return Math.floor(timeDiff / (1000 * 60 * 60)) + " hours ago";

  } else if(Math.floor(timeDiff / (1000 * 60)) > 0) {
    return Math.floor(timeDiff / (1000 * 60)) + " minutes ago";

  } else if (Math.floor(timeDiff / 1000) > 0) {
    return Math.floor(timeDiff / 1000) + " seconds ago";

  } else {
    return "0 seconds ago";
  }
}

// Function to create new comment in the DOM
function createCommentElement(commentArray) {
  let $newComment = $("<article>")
    .addClass("new-comment");

  // CREATE A COMMENT HEADER
  // create variable to store DOM elements in comment header element
  let $newCommentHeader = $("<header>")
    .addClass("new-comment-header");
  
  // User
  $("<p>")
    // set classes to new element
    .addClass("new-comment-header__user")
    // put text inside of new element
    .text(commentArray.name)
    // append the new element to parent
    .appendTo($newCommentHeader);
  // Timestamp
  $("<span>")
    .addClass("new-comment-header__timestamp")
    .text(postTime(commentArray.timestamp))
    .appendTo($newCommentHeader);
  
  // CREATE A COMMENT BODY
  // create variables to store DOM elements in comment body element
  let $newCommentBody = $("<div>")
    .addClass("new-comment-body")
    .text(commentArray.comment)

  // CREATE A COMMENT FOOTER
  //create variables to store DOM elements in comment footer element
  let $newCommentFooter = $("<footer>")
    .addClass("new-comment-footer");

  // Likes button and Likes count using font awesome
  $("<span>")
    .addClass("fas")
    .addClass("fa-thumbs-up")
    .attr("id", "like-btn")
    .appendTo($newCommentFooter);
  $("<span>")
    .addClass("new-comment-footer__likesCount")
    .text(commentArray.likes)
    .attr("id", "likes-Counts")
    .appendTo($newCommentFooter);

  // APPEND POSTED COMMENT HEADER, BODY AND FOOTER TO PARENT DOM
  $newComment.append($newCommentHeader).append($newCommentBody).append($newCommentFooter);

  return $newComment;
}

//  Function to fetch comments and put in DOM
function renderNewComment(commentArray) {
  $(".comments-post-container").empty();
  for(let i = 0; i < commentArray.length; i++) {
    // call the createCommentElement function
    let $newComment = createCommentElement(commentArray[i]);
    $(".comments-post-container").prepend($newComment);
  }
}

//=============HTTP REQUESTS=============//

// GET /comments GET request to fetch comments from API

function loadComment() {
  let url = `https://project-1-api.herokuapp.com/comments?api_key=${COMMENTS_API_KEY}`;
  fetch(url)
    .then(response => response.json())
    .then(jsonData => {
      renderNewComment(jsonData);
    })
    .catch(error => {
      throw Error (error.statusText)
    })
}

// POST /comments POST request to post new comments to API

// add event listener to the comment submit button
$(".comments-form__submit-btn").on("click", postComment);

function postComment(event) {
    event.preventDefault();
    // create variables to store values in the form
    let $nameValue = $("#comments-form__name-input").val();
    let $textareaValue = $("#comments-form__textarea").val();
   
    // create object to store new comments
    let commentObj;
    // post disallowed if name or comment is not there
    if (!$nameValue || !$textareaValue) {
      commentObj = {};
    } else {
       commentObj = {
        "name": $nameValue,
        "comment": $textareaValue
      };
    }

    let options = {
      body: JSON.stringify(commentObj),
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    };
    
    let postRequest = fetch(`https://project-1-api.herokuapp.com/comments?api_key=${COMMENTS_API_KEY}`, options)
    
    postRequest.then(jsonData => {
      // push the new comment object into the comment array
      commentArray.push(commentObj);
      loadComment();
    })
    .catch(error => {
      throw Error (error.statusText);
    });
}

// `PUT /comments/:id/like`
// Increments the like counter of the comment specified by `:id`

// add event listener to the likes button
$(document).on("click", "#like-btn", incrementLike);

function incrementLike() {

  let options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    }
  };

  let getRequest = fetch(`https://project-1-api.herokuapp.com/comments/?api_key=${COMMENTS_API_KEY}`);

  getRequest.then(response => response.json())
    .then(jsonData => {
      let existingIdsArray = jsonData.map((obj) => obj.id);
      let commentId = existingIdsArray[0]

      let putRequest = fetch(`https://project-1-api.herokuapp.com/comments/${commentId}/like?api_key=${COMMENTS_API_KEY}`, options)
  
      putRequest.then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        loadComment();
      })
  })
  .catch(error => {
    throw Error (error.statusText)
  })
}


$(document).ready(function () {
  loadComment();
});