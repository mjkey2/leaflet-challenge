//Create map object
var myMap = L.map("map", {
  center: [40, -100],
  zoom: 4
});

//Add tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);

// Only one base layer can be shown at a time.
let baseMaps = {
  Street: street,
  Topography: topo
};

// Create the key table
var keyTable = '<table>';
keyTable += '<tr><th>Depth</th><th>Color</th></tr>';
keyTable += '<tr><td>0 - 10 km</td><td style="background-color: ' + getColor(10) + '"></td></tr>';
keyTable += '<tr><td>10 - 20 km</td><td style="background-color: ' + getColor(20) + '"></td></tr>';
keyTable += '<tr><td>20 - 30 km</td><td style="background-color: ' + getColor(30) + '"></td></tr>';
// Add more rows for other depth ranges as needed
keyTable += '</table>';
// Add the key table to the HTML
document.getElementById('key').innerHTML = keyTable;

// Fetch the GeoJSON data
earthquakes = fetch('static/js/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        // Calculate the marker size based on the earthquake magnitude
        var markerSize = magnitude * 4;
        // Calculate the marker color based on the earthquake depth
        var markerColor = getColor(depth);
        // Create a circle marker for each earthquake
        return L.circleMarker(latlng, {
          radius: markerSize,
          fillColor: markerColor,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(myMap);
  });
  // Function to determine the marker color based on earthquake depth
  function getColor(depth) {
    // Define a color scale based on depth range
    var colorScale = chroma.scale(['#ffffcc', '#800026']).domain([0, 100]);
    // Map the depth value to a color using the color scale
    var color = colorScale(depth).hex();
    return color;
  }

// Step 1: Obtain the tectonic plates dataset
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Step 2: Import the tectonic plates dataset
d3.json(tectonicPlatesURL).then(function(data) {
  // Step 3: Create a new layer for the tectonic plates
  var tectonicPlatesLayer = L.geoJSON(data, {
    style: function(feature) {
      return {
        color: "orange",
        weight: 2
      };
    }
  });

  // Step 4: Add the tectonic plates layer to the map
  tectonicPlatesLayer.addTo(myMap);
});

// Create an overlayMaps object to hold the overlay layers
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlatesLayer
};

// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps).addTo(myMap);