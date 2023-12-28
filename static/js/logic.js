// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

// Fetch the GeoJSON data
fetch('static/js/all_day.geojson')
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
    }).addTo(map);
  });

// Function to determine the marker color based on earthquake depth
function getColor(depth) {
  // Define a color scale based on depth range
  var colorScale = chroma.scale(['#ffffcc', '#800026']).domain([0, 100]);

  // Map the depth value to a color using the color scale
  var color = colorScale(depth).hex();

  return color;
}