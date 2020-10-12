var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log (quakes)
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (plates)

function markerSize(magnitude) {
    return magnitude * 5;
};

var earthquakes = new L.LayerGroup();

d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },