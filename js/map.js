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
mymap.setMaxBounds([[15.69, 110.95], [35.69, 131.94]]);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: '5chieh/cld7vyvjt001101s97deir5oj',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiNWNoaWVoIiwiYSI6ImNsZDV6aW83YTA0Z2gzb2pvN2NlaGgwa2UifQ.1K0nOtmpdfmdNHEO2QVtGQ'
}).addTo(mymap);

var groupA = L.layerGroup().addTo(mymap);
var groupB = L.layerGroup().addTo(mymap);

var currentGroup = "A";

// 切換顯示Group的函數
function switchGroup() {
  if (currentGroup === 'A') {
    // 隱藏GroupA的Marker
    groupA.eachLayer(function (layer) {
      mymap.removeLayer(layer);
    });

    // 顯示GroupB的Marker
    groupB.eachLayer(function (layer) {
      mymap.addLayer(layer);
    });
    searchsmallBar.addTo(mymap);
    legendB.addTo(mymap);
    mymap.removeControl(legend);
    mymap.removeControl(searchBar);

    currentGroup = 'B';
  } else if (currentGroup === 'B') {
    // 隱藏GroupB的Marker
    groupB.eachLayer(function (layer) {
      mymap.removeLayer(layer);
    });

    // 顯示GroupA的Marker
    groupA.eachLayer(function (layer) {
      mymap.addLayer(layer);
    });
    searchBar.addTo(mymap);
    legend.addTo(mymap);
    mymap.removeControl(legendB);
    mymap.removeControl(searchsmallBar);
    currentGroup = 'A';
  }
}

L.Control.Button = L.Control.extend({
  options: {
      position: 'topleft'
  },
  _onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar switchbar');
    // var button = L.DomUtil.create('a', 'leaflet-control-button', container);
    // L.DomEvent.disableClickPropagation(button);
    L.DomEvent.on(container, 'click', function () {
      // console.log('click');
      switchGroup();

    });
    // container.title = "Title";
    container.type = "button";
    // container.style.width = '5em';
    container.style.width = '12em';
    container.style.backgroundColor = 'white'
    container.title = "小/百岳";
    container.onmouseover = function(){
      container.style.backgroundColor = '#777'; 
    }
    container.onmouseout = function(){
      container.style.backgroundColor = 'white'; 
    }
    container.innerHTML = "<h2>🔘百岳/🔘小百岳</h2>";
    // container.style.backgroundColor = 'pink'; 
    return container;
  },
  get onAdd() {
    return this._onAdd;
  },
  set onAdd(value) {
    this._onAdd = value;
  },
  onRemove: function(map) {},
});

var control = new L.Control.Button()
control.addTo(mymap);

function showMarker(mountains) {
  //Data is usable here
  // console.log(mountains);
  mountains.forEach((mountain) => {
    const popupContent = document.createElement("div")
    if (mountain.website){
      popupContent.innerHTML = "<h1>" + mountain.name +"</h1>" + "<h2><a target='_blank' href='"+mountain.website+"'>Blog</a></h2>" 
                              +'<a target="_blank" href=' +mountain.website + '>' + "<img src='" + "images/mountains/"+ mountain.file + ".jpg "+ "'>" + "</a>"
        window['marker'+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
                                { maxWidth: "auto" }).addTo(groupA);
              
          }
    else {
      popupContent.innerHTML = "<h1>" + mountain.name +"</h1>" + "<h3> To be finished </h3>"
      window['marker'+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountNotIcon}).bindPopup(popupContent,
        { maxWidth: "300" }).addTo(groupA);
    }
    
  })
}

function showMarkerSmall(mountains) {
  //Data is usable here
  // console.log(mountains);
  mountains.forEach((mountain) => {
    const popupContent = document.createElement("div")
    popupContent.innerHTML = "<h1>" + mountain.name +"</h1>" + "<h2><a target='_blank' href='"+mountain.website+"'>Blog</a></h2>" 
                              +'<a target="_blank" href=' +mountain.website + '>' + "<img src='" + "images/smallmountains/"+ mountain.file + ".jpg "+ "'>" + "</a>"
        window['marker'+"small"+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
                                { maxWidth: "auto" }).addTo(groupB);
    
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
parseData("data/Small_mountain.csv", showMarkerSmall);
mymap.removeLayer(groupB)

// Add legends
var legend = L.control({position: 'topleft'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    // div.innerHTML += '<input id="searchbar" onkeyup="search_mt()" type="text" name="search" placeholder="Search 百岳">'
    div.innerHTML +=  "<h3>"+'百岳完成進度'+"</h3>"
    div.innerHTML +=  '<img src="images/marker/mountains-64.png">' + "<h4>"+'Finished 82%'+"</h4>"
    div.innerHTML +=  '<img src="images/marker/mountains-notyet.png">'  + "<h4>"+' Not Yet 18%'+"</h4>"
    return div;
};

var legendB = L.control({position: 'topleft'});
legendB.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    // div.innerHTML += '<input id="searchbar" onkeyup="search_mt()" type="text" name="search" placeholder="Search 百岳">'
    div.innerHTML +=  "<h3>"+'小百岳完成進度'+"</h3>"
    div.innerHTML +=  '<img src="images/marker/mountains-64.png">' + "<h4>"+'Finished 100%'+"</h4>"

    return div;
};

// Add search bar
var searchBar = L.control({position: 'topleft'});
searchBar.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'searchbar');
  div.innerHTML += '<input id="searchbar" onkeyup="search_mt()" type="text" name="search" placeholder="搜尋百岳 ex: 玉山">'
  return div;
};

var searchsmallBar = L.control({position: 'topleft'});
searchsmallBar.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'searchbar');
  div.innerHTML += '<input id="searchsmallbar" onkeyup="search_smallmt()" type="text" name="search" placeholder="搜尋小百岳 ex: 稍來山">'
  return div;
};

searchBar.addTo(mymap);
legend.addTo(mymap);


function search_mt() {
  let input = document.getElementById('searchbar').value
  $.get("data/Mountain_info.csv", function(data) {
  var mtdata = $.csv.toObjects(data);
    mtdata.forEach((mt) => {
      if(mt.name === input){
        window['marker' + mt.file].openPopup();
      }
    })
  });
}

function search_smallmt() {
  let input = document.getElementById('searchsmallbar').value
  $.get("data/Small_mountain.csv", function(data) {
  var mtdata = $.csv.toObjects(data);
    mtdata.forEach((mt) => {
      if(mt.name === input){
        window['marker' +"small"+ mt.file].openPopup();
      }
    })
  });
}

