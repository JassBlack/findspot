//View

'use strict'

function showAddPlace() {
  if (document.querySelector('.main-window').style.display == 'none') {
    document.querySelector('.main-window').style.display = 'block';
    document.querySelector('.add-window').style.display = 'none';
  } else {
    document.querySelector('.main-window').style.display = 'none';
    document.querySelector('.add-window').style.display = 'block';
    initAddMap();
  };
};

function showLogin() {
  document.querySelector('.reg-section').style.display = 'none';
  document.querySelector('.main-form').style.display = 'block';
};

function showReg() {
  document.querySelector('.reg-section').style.display = 'block';
  document.querySelector('.main-form').style.display = 'none';
};

function showWelcome() {
  document.querySelector('.main-form').style.display = 'block';
  document.querySelector('.title-header').style.display = 'block';
  document.querySelector('.app-section').style.display = 'none';
  document.querySelector('.reg-section').style.display = 'none';
};

function showApp() {
  document.querySelector('.main-form').style.display = 'none';
  document.querySelector('.app-section').style.display = 'block';
  document.querySelector('.reg-section').style.display = 'none';
  document.querySelector('.title-header').style.display = 'none';
};