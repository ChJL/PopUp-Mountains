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
    accessToken: 'pk.eyJ1IjoiNWNoaWVoIiwiYSI6ImNtaXhsZ2hxcDA1OTEzanNra3VhNDk5d2QifQ.nRpXLaHmqK5Rdsmvygqhew'
}).addTo(mymap);

var groupA = L.layerGroup().addTo(mymap);
var groupB = L.layerGroup().addTo(mymap);

var currentGroup = "A";

// 切換顯示Group的函數
function switchGroup() {
  var btnA = document.getElementById('btn-group-a');
  var btnB = document.getElementById('btn-group-b');

  if (currentGroup === 'A') {
    // === 切換到 B (小百岳) ===
    
    // 1. 地圖邏輯
    groupA.eachLayer((layer) => mymap.removeLayer(layer));
    groupB.eachLayer((layer) => mymap.addLayer(layer));
    
    searchsmallBar.addTo(mymap);
    legendB.addTo(mymap);
    mymap.removeControl(legend);
    mymap.removeControl(searchBar);

    // 2. UI 邏輯 (切換按鈕樣式)
    btnA.classList.remove('active');
    btnB.classList.add('active');

    currentGroup = 'B';

  } else if (currentGroup === 'B') {
    // === 切換到 A (百岳) ===

    // 1. 地圖邏輯
    groupB.eachLayer((layer) => mymap.removeLayer(layer));
    groupA.eachLayer((layer) => mymap.addLayer(layer));
    
    searchBar.addTo(mymap);
    legend.addTo(mymap);
    mymap.removeControl(legendB);
    mymap.removeControl(searchsmallBar);

    // 2. UI 邏輯 (切換按鈕樣式)
    btnB.classList.remove('active');
    btnA.classList.add('active');

    currentGroup = 'A';
  }
}

L.Control.Button = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: function (map) {
    // 建立容器
    var container = L.DomUtil.create('div', 'leaflet-bar switch-container');
    
    // 防止點擊穿透到地圖 (非常重要)
    L.DomEvent.disableClickPropagation(container);

    // 建立 "百岳" 按鈕
    var btnA = L.DomUtil.create('div', 'switch-btn active', container);
    btnA.id = 'btn-group-a';
    btnA.innerHTML = '⛰️百岳'; // 你也可以加 icon: '<i class="fa fa-mountain"></i> 百岳'
    
    // 建立 "小百岳" 按鈕
    var btnB = L.DomUtil.create('div', 'switch-btn', container);
    btnB.id = 'btn-group-b';
    btnB.innerHTML = '🏃小百岳';

    // 綁定點擊事件
    // 這裡的邏輯是：只有當點擊「非當前」的按鈕時才觸發切換
    btnA.onclick = function() {
      if (currentGroup !== 'A') switchGroup();
    }
    
    btnB.onclick = function() {
      if (currentGroup !== 'B') switchGroup();
    }

    return container;
  },
  onRemove: function(map) {}
});

var control = new L.Control.Button();
control.addTo(mymap);

function showMarker(mountains) {
  //Data is usable here
  // console.log(mountains);
  mountains.forEach((mountain) => {
    const popupContent = document.createElement("div")
    if (mountain.website){
      popupContent.innerHTML = "<h1>" + mountain.name +"</h1>" + "<h2><a target='_blank' href='"+mountain.website+"'>Blog</a></h2>" 
                              +'<a target="_blank" href=' +mountain.website + '>' + "<img src='" + "images/mountains/"+ mountain.file + ".jpg "+ "'>" + "</a>"
      
      var isMobile = window.innerWidth < 600;

      // 根據裝置設定不同的 maxWidth
      var popupOptions = {
                maxWidth: isMobile ? 260 : 450, // 手機限縮在 260px，電腦則 300px
                minWidth: isMobile ? 200 : 300,
                autoPanPadding: [10, 10] // 確保 Popup 不會貼齊螢幕邊緣，留 10px 緩衝
            };
      
      window['marker'+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
                                popupOptions).addTo(groupA);
              
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
    var isMobile = window.innerWidth < 600;

    // 根據裝置設定不同的 maxWidth
    var popupOptions = {
                maxWidth: isMobile ? 260 : 450, // 手機限縮在 260px，電腦則 300px
                minWidth: isMobile ? 200 : 300,
                autoPanPadding: [10, 10] // 確保 Popup 不會貼齊螢幕邊緣，留 10px 緩衝
            };

    window['marker'+"small"+ mountain.file] = L.marker([mountain.lat, mountain.lng],{icon: mountIcon}).bindPopup(popupContent,
                                popupOptions).addTo(groupB);
    
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
  var div = L.DomUtil.create('div', 'search-container');
  div.innerHTML += '<input id="searchbar" class="custom-input" onkeyup="search_mt()" type="text" name="search" placeholder="搜尋百岳 ex: 玉山">'
  return div;
};

var searchsmallBar = L.control({position: 'topleft'});
searchsmallBar.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'search-container');
  div.innerHTML += '<input id="searchsmallbar" class="custom-input" onkeyup="search_smallmt()" type="text" name="search" placeholder="搜尋小百岳 ex: 稍來山">'
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

