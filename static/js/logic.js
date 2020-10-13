var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(quakes, function(data) {
    createFeatures(data.features);
    console.log(data.features)
  });

  function createFeatures(quakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }

      function radiusSize(magnitude) {
        return magnitude * 5000;
      }

      function circleColor(magnitude) {
        if (magnitude < 1) {
          return "darkgreen"
        }
        else if (magnitude < 2) {
          return "yellow"
        }
        else if (magnitude < 3) {
          return "darkyellow"
        }
        else if (magnitude < 4) {
          return "orange"
        }
        else if (magnitude < 5) {
          return "red"
        }
        else {
          return "green"
        }
      }

      var earthquakes = L.geoJSON(quakeData, {
        pointToLayer: function(quakeData, latlng) {
          return L.circle(latlng, {
            radius: radiusSize(quakeData.properties.mag),
            color: circleColor(quakeData.properties.mag),
            fillOpacity: 0.5
          });
        },
        onEachFeature: onEachFeature
      });

      createMap(earthquakes);
    }
    
    function createMap(earthquakes) {
    
        
        
        var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
          });
    
    
        var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
            });
    
        var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
            });

      var faultLine = new L.LayerGroup();

      var baseMaps = {
        "Satellite Map": satellitemap,
        "Greyscale Map": grayscalemap
      };

      var overlayMaps = {
        Earthquakes: earthquakes,
        FaultLines: faultLine
      };

      var myMap = L.map("map-id", {
        center: [
            35.23, -80.85
        ],
        zoom: 4,
        layers: [outdoorsmap, earthquakes, faultLine]
      });
      
     L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

    d3.json(faultlinequery, function(data) {
        L.geoJSON(data, {
          style: function() {
            return {color: "blue", fillOpacity: 0.2}
          }
        }).addTo(faultLine)
    })

    function getColor(d) {
        return d >= 5 ? 'red' :
               d >= 4  ? 'orange' :
               d >= 3  ? '#cece06' :
               d >= 2  ? 'yellow' :
               d >= 1  ? 'darkgreen' :
                        'green';
    }

    var legend = L.control({position: 'topright'});

    legend.onAdd = function (map) {
  
        var div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 1, 2, 3, 4, 5],
            labels = [];

            for (var i = 0; i < mags.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
                    mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
            }
        
            return div;
        };
        
        legend.addTo(myMap);
      }