/* eslint-disable */

import { login, logout } from './login';
import { displayMap } from './mapbox';
import L from 'leaflet';

//DOM Elements
const mapBoxEl = document.getElementById('map');
const loginFormEl = document.querySelector('.form');
const logoutBtnEl = document.querySelector('.nav__el--logout');

//Values

// Delegation
if (mapBoxEl) {
  const locations = JSON.parse(mapBoxEl.dataset.locations);
  displayMap(L, locations);
}

loginFormEl?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;
  login(email, password);
});

logoutBtnEl?.addEventListener('click', (e) => logout());
