/* eslint-disable */

import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';

import L from 'leaflet';

//DOM Elements
const mapBoxEl = document.getElementById('map');
const loginFormEl = document.querySelector('.form--login');
const logoutBtnEl = document.querySelector('.nav__el--logout');
const userDataFormEl = document.querySelector('.form-user-data');
const userPasswordFormEl = document.querySelector('.form-user-password');

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

userDataFormEl?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  updateSettings({ name, email }, 'data');
});

userPasswordFormEl?.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.querySelector('.btn--save-password').textContent = 'Updating...';

  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;

  await updateSettings(
    { passwordCurrent, password, passwordConfirm },
    'password',
  );

  document.querySelector('.btn--save-password').textContent = 'Update Password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});

logoutBtnEl?.addEventListener('click', (e) => logout());
