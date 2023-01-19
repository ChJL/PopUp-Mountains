var mountIcon = L.icon({
	iconUrl: 'images/marker/mountains-64.png',
	iconSize:     [35, 35], // size of the icon
});


var mapOptions = {
    center: [23.5, 121.1],
    zoom: 9
  }
var mymap = L.map('mapid', mapOptions);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v12',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZGFuZmVyd2FuZyIsImEiOiJja2xpN2NndWgyYTI1MndzNDV1bjBrY2d2In0.WdslBmCdgObpqBD0e60C3g'
}).addTo(mymap);

// Other way to read csv and show marker
// $.get("data/Mountain_info.csv", function(data) {
//   var mountains = $.csv.toObjects(data);
//   // console.log(mountains);
//   // Use mountains as a dictionary
//   mountains.forEach((mountain) => {
//     const popupContent = document.createElement("div")
//     // popupContent.innerHTML = "<h3>" + mountain.placename +"</h3>" + "<img src='" + "images/mountains/"+ mountain.filename + ".jpg "+ "'>"
//     const marker = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
//         { maxWidth: "auto" }).addTo(mymap);
//   })
// });


function showMarker(mountains) {
  //Data is usable here
  console.log(mountains);
  mountains.forEach((mountain) => {
    const popupContent = document.createElement("div")
    popupContent.innerHTML = "<h2>" + mountain.name +"</h2>" + "<a href='"+mountain.website+"'>Blog</a>"
    const marker = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
        { maxWidth: "200" }).addTo(mymap);
  })
}

function parseData(url, callBack) {
  var csvData;
    $.get(url, function(data) {
        csvData = $.csv.toObjects(data);
        callBack(csvData);
    });
}

parseData("data/Mountain_info.csv", showMarker);
