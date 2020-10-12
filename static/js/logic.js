var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log (quakes)
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (plates)

function markerSize(magnitude) {
    return magnitude * 5;
};

var earthquakes = new L.LayerGroup();

d3.json(quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.6,
                weight: 0.2,
                color: 'black'
                
            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var tectonicplates = new L.LayerGroup();

d3.json(plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 3,
                color: 'blue'
            }
        },
    }).addTo(tectonicplates);
})

function Color(magnitude) {
    if (magnitude > 5) {
        return 'darkorange'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'darkyellow'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};