//Controller

'use strict'

var logoutButton = document.querySelector('.logout-button');
var addButton = document.querySelector('.main-header__icon--add-find');
var regLink = document.querySelector('.reg-link');
var loginLink = document.querySelector('.login-link');
var loginForm = document.querySelector('.login-form');
var regForm = document.querySelector('.reg-form');
var searchForm = document.querySelector('.app-form');
var addForm = document.querySelector('.add-form');

logoutButton.onclick = logout;
regLink.onclick = showReg;
loginLink.onclick = showLogin;
addButton.onclick = showAddPlace;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    showApp();

  } else {
    showWelcome();
  };
});

loginForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  login();
});

searchForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  showLocation();
});

regForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  register();
});

addForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  addPlace();
});