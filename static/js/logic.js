// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

// Fetch the GeoJSON data
fetch('path/to/earthquake-data.geojson')
  .then(response => response.json())
  .then(data => {
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var magnitude = feature.properties.mag;

        // Create a circle marker for each earthquake
        return L.circleMarker(latlng, {
          radius: magnitude * 2,
          fillColor: 'red',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  });