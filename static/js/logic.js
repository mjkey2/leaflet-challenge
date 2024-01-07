// Create a new layer group for the tectonic plates
var tectonicPlates = new L.LayerGroup();

// Fetch the tectonic plates data
fetch("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
  .then(response => response.json())
  .then(platesData => {
    // Create a GeoJSON layer for the tectonic plates data
    L.geoJSON(platesData, {
      style: function(feature) {
        return {
          color: "orange",
          weight: 2
        };
      }
    }).addTo(tectonicPlates);
  });

// Add the tectonic plates layer to the map
tectonicPlates.addTo(map);

// Define additional tile layers
var satelliteMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
});

// Add the additional tile layers to the baseMaps object
var baseMaps = {
  "Street Map": streetMap,
  "Topographic Map": topoMap,
  "Satellite Map": satelliteMap
};

// Create an overlayMaps object to hold the overlay layers
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Add a layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);