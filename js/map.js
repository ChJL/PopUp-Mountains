var mountIcon = L.icon({
	iconUrl: 'images/marker/mountains-64.png',
	iconSize:     [35, 35], // size of the icon
});
var mountNotIcon = L.icon({
	iconUrl: 'images/marker/mountains-notyet.png',
	iconSize:     [35, 35], // size of the icon
});

var mapOptions = {
    center: [23.69, 120.94],
    zoom: 9
  }
var mymap = L.map('mapid', mapOptions);
mymap.setMaxBounds([[21.69, 119.95], [26.69, 121.94]]);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: '5chieh/cld7vyvjt001101s97deir5oj',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiNWNoaWVoIiwiYSI6ImNsZDV6aW83YTA0Z2gzb2pvN2NlaGgwa2UifQ.1K0nOtmpdfmdNHEO2QVtGQ'
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
    if (mountain.website){
      popupContent.innerHTML = "<h1>" + mountain.name +"</h1>" + "<h2><a target='_blank' href='"+mountain.website+"'>Blog</a></h2>" 
                              +'<a target="_blank" href=' +mountain.website + '>' + "<img src='" + "images/mountains/"+ mountain.file + ".jpg "+ "'>" + "</a>"
        window['marker'+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
                                { maxWidth: "auto" }).addTo(mymap);
              
          }
    else {
      popupContent.innerHTML = "<h1>" + mountain.name +"</h1>" + "<h3> To be finished </h3>"
      window['marker'+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountNotIcon}).bindPopup(popupContent,
        { maxWidth: "300" }).addTo(mymap);
    }
    
  })
}

function parseData(url, callBack) {
  var csvData;
    $.get(url, function(data) {
        csvData = $.csv.toObjects(data);
        callBack(csvData);
    });
}
// Show marker and PopUp func
parseData("data/Mountain_info.csv", showMarker);
// Add legends
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    // div.innerHTML += '<input id="searchbar" onkeyup="search_mt()" type="text" name="search" placeholder="Search 百岳">'
    div.innerHTML +=  "<h3>"+'百岳完成進度'+"</h3>"
    div.innerHTML +=  '<img src="images/marker/mountains-64.png">' + "<h4>"+'Finished 82%'+"</h4>"
    div.innerHTML +=  '<img src="images/marker/mountains-notyet.png">'  + "<h4>"+' Not Yet 18%'+"</h4>"
    return div;
};
legend.addTo(mymap);

// Add search bar
var searchBar = L.control({position: 'topleft'});
searchBar.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'searchbar');
  div.innerHTML += '<input id="searchbar" onkeyup="search_mt()" type="text" name="search" placeholder="搜尋百岳 ex: 玉山">'
  return div;
};
searchBar.addTo(mymap)


function search_mt() {
  let input = document.getElementById('searchbar').value
  console.log(input);
  $.get("data/Mountain_info.csv", function(data) {
  var mtdata = $.csv.toObjects(data);
    mtdata.forEach((mt) => {
      if(mt.name === input){
        window['marker' + mt.file].openPopup();
      }
    })
  });
}
