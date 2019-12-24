/* eslint-disable */

console.log('hello from client');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2Vua2lya2xleTEzMzAiLCJhIjoiY2s0azY0bWJhMGE5aTNuczB0ZnpvajZtcCJ9.lg0WeUNz_EA2VWfcm_XZVQ';

// needs an element with the id of map in html
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kenkirkley1330/ck4k6i3xr0pqn1cmnqe8b9b6b',
  scrollZoom: false
  //   center: [-118.113491, 34.111745],
  //   zoom: 5,
  //   interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  // marker is in style.css
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  // extends map to include location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
