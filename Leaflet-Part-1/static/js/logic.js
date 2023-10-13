let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Create the map and set its initial view
let myMap = L.map("map", {
  center: [40, 40],
  zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(queryUrl)
    .then(function (data) {
        //console.log(data);
        data.features.forEach(function(feature) {
            let location = [];
            long = feature.geometry.coordinates[0];
            lat = feature.geometry.coordinates[1];
            location.push(long);
            location.push(lat);
            //console.log(location)

            let magnitude = feature.properties.mag;
            //console.log(magnitude);

            depthStr = feature.geometry.coordinates[2];
            depth = parseFloat(depthStr);
            //console.log(depth);

            // Calculate marker size and color based on magnitude and depth
            const markerOptions = {
            radius: (magnitude*magnitude)/2.75, // Adjust this factor for desired marker size
            fillColor: getColor(depth), // Function to set color based on depth
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            };
            
            // Create the marker
            const marker = L.circleMarker(location, markerOptions)
            .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr>Magnitude: ${magnitude}<br>Depth: ${depth}`)
            .addTo(myMap);
        });
  });

    // Define a function to set marker color based on depth
function getColor(depth) {
    // You can define different color ranges based on depth
    if (depth < 10) return "#16BD05";
    else if (depth < 30) return "#95E825";
    else if (depth < 50) return "#FFC122";
    else if (depth < 70) return "#FA8715";
    else if (depth < 90) return "#ED6464";   
    else return "#FF3232";
}

// Create a legend
const legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  const div = L.DomUtil.create("div", "info legend");

  // Define legend content (e.g., depth ranges with colors)
  const labels = [
    "-10-10",
    "10-30",
    "30-50",
    "50-70",
    "70-90",
    ">90"
  ];
    
  const colors = ["#16BD05", "#95E825", "#FFC122", "#FA8715", "#ED6464", "#FF3232"];

  // Generate the legend HTML
  for (let i = 0; i < labels.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' + labels[i] + (i < labels.length - 1 ? "<br>" : "");
  }

  return div;
};

legend.addTo(myMap);