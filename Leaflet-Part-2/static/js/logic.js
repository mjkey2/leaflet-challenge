// Create the foundation map
var myMap = L.map("map").setView([37.09, -95.71], 3);

// Create the base layers
var satelliteMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
}).addTo(myMap);

var grayscaleMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
});

var outdoorsMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
});

// Create the overlay layers
var earthquakes = L.layerGroup();
var tectonicPlates = L.layerGroup();

// Add the overlay layers to the map
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

L.control.layers(null, overlayMaps).addTo(myMap);

// Load the earthquake data
d3.json("static/js/all_day.geojson", function(data) {
  // Function to determine marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 5;
  }

  console.log(yourObject);

  // Function to determine marker color based on earthquake depth
  function markerColor(depth) {
    if (depth < 10) {
      return "#00ff00";
    } else if (depth < 30) {
      return "#ffff00";
    } else if (depth < 50) {
      return "#ff9900";
    } else if (depth < 70) {
      return "#ff6600";
    } else if (depth < 90) {
      return "#ff3300";
    } else {
      return "#ff0000";
    }
  }

  // Create the earthquake markers
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km");
    }
  }).addTo(earthquakes);

  // Add the earthquake layer to the map
  earthquakes.addTo(myMap);
});

// Load the tectonic plate data
d3.json("js/tectonicplates-master/PB2002_plates.json", function(data) {
  // Create the tectonic plate outlines
  L.geoJSON(data, {
    style: function() {
      return {
        color: "#ff0000",
        weight: 2
      };
    }
  }).addTo(tectonicPlates);
});