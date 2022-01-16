// Creating map object
var myMap = L.map("map", {
  center: [20.50, -70.35],
  zoom: 2.5
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create functions for styling of circles
function colouring(magnitude){
    switch(true){
      case magnitude >= 5:
      return "red";
      case magnitude >= 2.5:
        return "orange";
      default:
        return "green";
  }
}

// size of circles
function size(magnitude){
  return magnitude*5;
}

// Grab the data with d3
d3.json(url).then(function(response) {
  L.geoJson(response, {
    // add circles to specific locations
    pointToLayer: function(response, latlng){
      return L.circleMarker(latlng);
    },
    // style of circles, colour, size, opacity
    style: function(feature)
    {
      return {
              radius: size(feature.properties.mag),
              opacity: 1,
              fillColor: colouring(feature.properties.mag ),
              fillOpacity: 0.7,
              color:colouring(feature.properties.mag),
            }
  },
  // add pop up box with magnitude and location info
  onEachFeature: function(feature, layer){
    layer.bindPopup(`Magnitude: ${feature.properties.mag}<br> Location: ${feature.properties.place}`);
  }
  }).addTo(myMap);
 

  // create legend
  var legend = L.control({position:"bottomright"});

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    levels = [0, 2.5, 5]
    div.innerHTML += "<h3>Magnitude</h3>";

    for (var i = 0; i < levels.length; i++) {
      div.innerHTML +=
          '<i style="background: ' + colouring(levels[i+1]) + '"></i> ' +
          levels[i] + (levels[i + 1] ? ' &ndash; ' + levels[i+1] + '<br>' : '+');
          console.log(colouring(levels[i]));
  }
    return div;
  };
  

  legend.addTo(myMap);

});
