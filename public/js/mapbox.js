/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

let map = L.map('map').setView(
  [locations[0].coordinates[1], locations[0].coordinates[0]],
  8,
);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

locations.forEach((loc) => {
  let cord = loc.coordinates;
  [cord[0], cord[1]] = [cord[1], cord[0]];
  L.marker(cord).addTo(map).bindPopup(loc.description).openPopup();
});

map.on('load', function (e) {});
