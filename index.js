'use strict';

const appKey = "g36mitchell";

const searchURL = 'https://api.github.com/users';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults, username) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-avatar').empty();
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  
  if (responseJson.length != 0) {
         $('#results-avatar').append(`<img src="${responseJson[0].owner.avatar_url}" alt="avatar"></img>`);
          for (let i = 0; i < responseJson.length & i< maxResults ; i++){
               $('#results-list').append(
                 `<li><h3><a href="${responseJson[i].html_url}" target="_blank" title="${username}">${responseJson[i].full_name}</a></h3>
                 <p>Description: ${responseJson[i].description}</p>
                 <p>Last update: ${responseJson[i].updated_at}</p>
                 <p>Watchers: ${responseJson[i].watchers}</p>
                 <p>Language: ${responseJson[i].language}</p>
                 </li>`
                   )};
             //display the results section  
    }
    else {
        $('#results-list').append(`<p>No repositories found for this handle.</p>`);
    }

    $('#results').removeClass('hidden');

};

function getRepo(query) {
  const params = {
    "sort": "updated"
  };
  const queryString = formatQueryParams(params)
  const maxResults = 10;
  const url = `${searchURL}/${query}/repos?${queryString}`;

  console.log(url);

 
  const options = {
    headers: new Headers({
      "User-Agent": appKey,
      "Accept": "application/vnd.github.v3+json"})
  };

  $('#results').addClass('hidden');
  $('#results-avatar').empty();
  $('#results-list').empty(); 
  $('#js-error-message').empty();

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults, query)
 /*         console.log(responseJson)  */
    )
    .catch(err => {
      $('#js-error-message').text(`Oops! GitHub says: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getRepo(searchTerm);
  });
}

$(watchForm);