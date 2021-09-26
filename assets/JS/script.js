const APIKey = "B55ZQWUIfhkzWvNarvOrlfh8ivj5W4hV3zZB7I47";

//Variables for Near Earth Objects (NEO)
var CURRENTDAY = moment().format("YYYY-MM-DD");
var nearEarthObjectsCall =
  "https://api.nasa.gov/neo/rest/v1/feed?api_key=" +
  APIKey +
  "&start_date=" +
  CURRENTDAY +
  "&end_date=" +
  CURRENTDAY;
console.log(nearEarthObjectsCall);
var neoForm = document.getElementById("neo-form");
var neoDate = document.getElementById("neo-input");

// variables for NASA Image Library API
var nivlSearchTerm = "";
var nivlUrl =
  "https://images-api.nasa.gov/search?q=" +
  nivlSearchTerm +
  "&media_type=image&page=1&year_start=2018&year_end=2021";
console.log(nivlUrl);
var searchLibraryForm = document.getElementById("vid-img-form");
var searchLibBtnEl = document.getElementById("search-imgLibrary");

//--------Functions for NASA image of the Day---------
//Display NASA image of the day
function displayPicture(data) {
  let podElm = document.getElementById("pod-img");
  podElm.setAttribute("src", data.url);

  let imgLink = document.getElementById("img-link");
  imgLink.setAttribute("href", data.url);

  let mediaContent = document.querySelector(".media-content .title");
  mediaContent.textContent = data.title;

  let pictureDate = document.querySelector(".date-taken");
  pictureDate.textContent =
    "Date of Picture: " + moment(data.date).format("MMMM Do, YYYY");

  let podContent = document.querySelector(".content");
  podContent.textContent = data.explanation;
}

//Search image for a specific date
function searchImagebyDate(searchDate) {
  let searchByDateEl = document.getElementById("specific-date");
  let dateParam =
    typeof searchDate === "string" ? searchDate : searchByDateEl.value;
  let searchResult = document.getElementById("searchResult");
  if (!searchByDateEl.value) {
    searchResult.innerHTML = "<h2>Please select a specific date!</h2>";
  } else {
    searchResult.innerHTML = "";
    const url =
      "https://api.nasa.gov/planetary/apod?api_key=" +
      APIKey +
      "&date=" +
      dateParam;
    console.log(url);

    fetch(url)
      .then(function (response) {
        console.log(url);
        if (response.status !== 200) {
          searchResult.innerHTML =
            "NASA Image of the day response: " +
            response.status +
            ". Data unavailable!";
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        displayPicture(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

//Display image data from Range
function displayPictureItem(dateFromRow) {
  let dateParam = dateFromRow;
  const url =
    "https://api.nasa.gov/planetary/apod?api_key=" +
    APIKey +
    "&date=" +
    dateParam;
  console.log(url);

  fetch(url)
    .then(function (response) {
      console.log(url);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayPicture(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

//Function to search NASA images from a Range of images
function searchImageByRange() {
  let fromDateEl = document.getElementById("from-date").value;
  let toDateEl = document.getElementById("to-date").value;
  let searchResult = document.getElementById("searchResult");

  if (!fromDateEl || !toDateEl) {
    searchResult.innerHTML = "<h2>Please select a date!</h2>";
  } else {
    searchResult.innerHTML = "";

    const url =
      "https://api.nasa.gov/planetary/apod?api_key=" +
      APIKey +
      "&start_date=" +
      fromDateEl +
      "&end_date=" +
      toDateEl;
    console.log(url);

    fetch(url)
      .then(function (response) {
        if (response.status !== 200) {
          searchResult.innerHTML =
            "NASA Image of the day response: " +
            response.status +
            ". Data unavailable!";
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data.length);

        for (let i = 0; i < data.length; i++) {
          let imgResultElm = document.createElement("img");
          imgResultElm.classList.add("image");
          imgResultElm.setAttribute("alt", data[i].title);
          imgResultElm.setAttribute("src", data[i].url);

          let strongElm = document.createElement("strong");
          strongElm.textContent = data[i].title;

          let outerDiv = document.createElement("div");
          outerDiv.classList.add("result-item");
          outerDiv.setAttribute(
            "onclick",
            "displayPictureItem('" + data[i].date + "')"
          );
          outerDiv.append(
            imgResultElm,
            moment(data[i].date).format("MMMM Do, YYYY"),
            strongElm
          );
          searchResult.appendChild(outerDiv);
        }

        /* // let searchData = data.map((d) => { */
        //   let elm = `<img src="${d.url}" class="image" alt="${
        //     d.title}">${moment(d.date).format("MMMM Do, YYYY")} <strong>${
        //     d.title
        //   }</strong>`;
        //   let card = `<div class="result-item" onclick="displayPictureItem('${d.date}')">${elm}</div>`;
        //   return card;
        // });

        //searchResult.innerHTML = searchData.join("");
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

//--------Functions for NEO Data---------

function createTable(nearEarthData, queryDate) {
  var date = queryDate.trim();
  var earthObjectsArray = nearEarthData.near_earth_objects[date];
  console.log(date);
  console.log(earthObjectsArray);
  var objectTable = document.getElementById("object-table");

  // this is for selecting the rows to remove when a new search is made. Since the if statement is looking for length that is greater than 1, it won't run upon initializing.

  var tableData = document.querySelectorAll("tr");
  console.log(tableData.length);

  if (tableData.length > 1) {
    for (i = 0; i < tableData.length - 1; i++) {
      objectTable.deleteRow(1);
    }
  }

  for (let i = 0; i < earthObjectsArray.length; i++) {
    // grabbing data from the output.
    var objectName = earthObjectsArray[i].name;
    var objectSize =
      Math.round(
        earthObjectsArray[i].estimated_diameter.meters.estimated_diameter_max
      ) + " m";
    var objectVelocity =
      Math.round(
        earthObjectsArray[i].close_approach_data[0].relative_velocity
          .kilometers_per_hour
      ) + " km/h";
    var objectMissDistance =
      Math.round(
        earthObjectsArray[i].close_approach_data[0].miss_distance.kilometers
      ) + " km";
    var objectMagnitude = earthObjectsArray[i].absolute_magnitude_h + " H";
    var objectLink = earthObjectsArray[i].nasa_jpl_url;

    // creating table rows and table data. I'm thinking that it would be best to have the table tag and header in the actual HTML.
    var createRow = document.createElement("tr");

    var tableDataDate = document.createElement("td");
    tableDataDate.textContent = date;
    var tableDataName = document.createElement("td");
    var tableDataNameLink = document.createElement("a");
    tableDataName.append(tableDataNameLink);
    tableDataNameLink.setAttribute("href", objectLink);
    tableDataNameLink.setAttribute("target", "_blank");
    tableDataNameLink.textContent = objectName;
    var tableDataSize = document.createElement("td");
    tableDataSize.textContent = objectSize;
    var tableDataVelocity = document.createElement("td");
    tableDataVelocity.textContent = objectVelocity;
    var tableDataMissDistance = document.createElement("td");
    tableDataMissDistance.textContent = objectMissDistance;
    var tableDataMagnitude = document.createElement("td");
    tableDataMagnitude.textContent = objectMagnitude;

    objectTable.appendChild(createRow);

    var selectRow = document.getElementById("object-table").lastChild;

    selectRow.appendChild(tableDataDate);
    selectRow.appendChild(tableDataName);
    selectRow.appendChild(tableDataSize);
    selectRow.appendChild(tableDataVelocity);
    selectRow.appendChild(tableDataMissDistance);
    selectRow.appendChild(tableDataMagnitude);
  }
}

// creating function which creates the initial table to be loaded.
function callNearEarthApi(nearEarthObjectsCall, date) {
  fetch(nearEarthObjectsCall)
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      createTable(data, date);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//NEO Event Listener
var neoSearchEl = document.getElementById("neo-search");
neoSearchEl.addEventListener("click", function (event) {
  event.preventDefault();
  var newNeoInputDate = neoDate.value;
  console.log(newNeoInputDate);
  var updatedCall =
    "https://api.nasa.gov/neo/rest/v1/feed?api_key=" +
    APIKey +
    "&start_date=" +
    newNeoInputDate +
    "&end_date=" +
    newNeoInputDate;
  callNearEarthApi(updatedCall, newNeoInputDate);
});

////--------Initialize Function---------
function init() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${APIKey}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayPicture(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// initial call of the function to create the table for NEO Data.
callNearEarthApi(nearEarthObjectsCall, CURRENTDAY);

//--------NASA Image Library Functions---------
function createRandomImg(data) {
  console.log(data);
  var arrayLength = data.collection.items.length;
  console.log(arrayLength);
  var randItem = Math.floor(Math.random() * arrayLength);
  console.log(randItem);
  var selectedImg = data.collection.items[randItem].links[0].href;
  console.log(selectedImg);
  var imgDescription = data.collection.items[randItem].data[0].description;
  console.log(imgDescription);
  var imgAltText = data.collection.items[randItem].data[0].title;
  console.log(imgAltText);
  var libraryImg = document.getElementById("library-image");
  libraryImg.setAttribute("src", selectedImg);
  libraryImg.setAttribute("alt", imgAltText);
  var libraryDescription = document.getElementById("img-description");
  libraryDescription.textContent = imgDescription;
  var dateTimeStamp = data.collection.items[randItem].data[0].date_created;
  var imgDateTaken = document.getElementById("img-date");
  imgDateTaken.textContent =
    "Date of Picture: " + moment(dateTimeStamp).format("MMMM Do, YYYY");
  var imgTitle = document.getElementById("img-title");
  imgTitle.textContent = imgAltText;
}

function fetchImage(nivlUrl) {
  //fetched url data
  fetch(nivlUrl)
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      createRandomImg(data);
    });
}

function searchImageDatabase(event) {
  event.preventDefault();
  var searchLibInput = document.getElementById("vid-img-search");
  nivlSearchTerm = searchLibInput.value;
  var searchCall =
    "https://images-api.nasa.gov/search?q=" +
    nivlSearchTerm +
    "&media_type=image&page=1&year_start=2018&year_end=2021";
  fetchImage(searchCall);
}

searchLibraryForm.addEventListener("submit", searchImageDatabase);
searchLibBtnEl.addEventListener("click", searchImageDatabase);

fetchImage(nivlUrl);

//------------Window initiate function---------------

window.addEventListener("DOMContentLoaded", (event) => {
  var searchImageBtn = document.getElementById("search-image");
  searchImageBtn.addEventListener("click", searchImagebyDate);
  searchImageBtn.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      searchImagebyDate(event);
    }
  });

  var searchImgByDateBtn = document.getElementById("searchImg-byRange");
  searchImgByDateBtn.addEventListener("click", searchImageByRange);
  searchImgByDateBtn.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      searchImageByRange(event);
    }
  });
  init();
});
