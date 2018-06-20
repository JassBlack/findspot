//Model

'use strict'

var database = firebase.database();
var map;
var places = [];
var tempData = {};
var addMarkerCoords = {};
var markerCity;

function initAddMap() {
  var options = {
    center: {lat: 63.606701, lng: 26.890600},
    zoom: 6
  };

  map = new google.maps.Map(document.getElementById('map__add'), options);
  var marker;

  google.maps.event.addListener(map, 'click', function(event){

    if (marker) {
      marker.setPosition(event.latLng);
    } else {
      marker = new google.maps.Marker({
        position:event.latLng,
        map:map,
      });
    };

    addMarkerCoords.lat = marker.getPosition().lat();
    addMarkerCoords.lng = marker.getPosition().lng();

    findCity();
  });
};

function addPlace() {
  var placeName = document.querySelector('#add-name').value;
  var placeDescription = document.querySelector('#add-description').value;
  var placeLat = addMarkerCoords.lat + '';
  var placeLng = addMarkerCoords.lng + '';
  var placeCoords = placeLat + ', ' + placeLng;
  var placeId = placeLat.split('.').join('') + placeLng.split('.').join('');

  firebase.database().ref('places/' + placeId).set({
    city: markerCity,
    coordinates: placeCoords,
    description: placeDescription,
    name: placeName
  });

  window.alert('Place was succsessfully added, you will be redirected to the main page');
  document.querySelector('.main-window').style.display = 'block';
  document.querySelector('.add-window').style.display = 'none';
};

function findCity(e) {
  var coords = addMarkerCoords.lat + ' ' + addMarkerCoords.lng;

  axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
    params:{
      latlng:coords,
      key:'AIzaSyAmV1T_J6_noWuMYBJukYv3-eDBvhr3zmY'
    }
  })
  .then(function(response){

    markerCity = response.data.results[0].address_components[2].long_name;
  });
};

function initMap(customOptions) {
  var options = {
    center: {lat: 63.606701, lng: 26.890600},
    zoom: 6
  };

  map = new google.maps.Map(document.getElementById('map'), options);
};

function addMarkersToMap() {
  for (var i = 0; i < places.length; i++){
    addMarker(places[i]);
  };
};

function login() {
  var userEmail = document.querySelector('#log-email').value;
  var userPass = document.querySelector('#log-pass').value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {

    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert('Error: ' + errorMessage)
  });
};

function logout() {
  firebase.auth().signOut();
};

function register() {
  var userEmail = document.querySelector('#reg-email').value;
  var userPass = document.querySelector('#reg-pass').value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert('Error: ' + errorMessage);
  });
};

function loadPlaces(callback) {
  var placesRef = firebase.database().ref().child("places");
  var tempCoords = {};
  var tempObject = {};
  var infoWindowNode = document.querySelector('.info-window');
  places = [];

  placesRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      tempData = {};
      tempData.photos = [];
      
      tempData.key = childSnapshot.key;
      tempData.city = childSnapshot.val().city;
      tempData.description = childSnapshot.val().description;
      tempData.name = childSnapshot.val().name;

      if (childSnapshot.val().photos) {
        for (var i = 0; i < childSnapshot.val().photos.length; i++) {
          tempData.photos[i] = childSnapshot.val().photos[i];
        };
      };

      tempCoords = childSnapshot.val().coordinates.split(',');

      tempData.coords = {
        lat: +tempCoords[0],
        lng: +tempCoords[1]
      };

      places.push(tempData);
      addMarker(tempData);
    });
  });

  initMap();
};

function addMarker(props){
  var marker = new google.maps.Marker({
    position: props.coords,
    map: map,
  });

  var textInfo = '<div class="info-window__title"> ' + props.name + '</div>' + 
    '<div class="info-window__city"> ' + props.city + '</div>' +
    '<div class="info-window__text"> ' + props.description + '</div>';

  if (props.photos) {
    for (var i = 0; i < props.photos.length; i++) {
      textInfo += '<img src="' + props.photos[i] + '" class="info-window__photo">';
    };
  };

  var contentString = '<div class="info-window">' + textInfo + '</div>';
  var infoWindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 300
  });

  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
};

function showLocation(e) {
  var location = document.getElementById('app-search').value;

  axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
    params:{
      address:location,
      key:'AIzaSyAmV1T_J6_noWuMYBJukYv3-eDBvhr3zmY'
    }
  })
  .then(function(response){
    var searchCoords = {};
    searchCoords.lat = response.data.results[0].geometry.location.lat;
    searchCoords.lng = response.data.results[0].geometry.location.lng;

    map.setCenter(searchCoords);
    map.setZoom(12);
  })
  .catch(function(error){
    window.alert('Error: ' + error);
  });
};