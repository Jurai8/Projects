
// ignore for now
var admin = require("firebase-admin");

var serviceAccount = require("./charlies-project-2fcac-firebase-adminsdk-hggn1-b0c290d5fb.json");

admin.initializeApp({
  databaseURL: "https://charlies-project-2fcac.firebaseio.com"
});



