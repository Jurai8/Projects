
// ignore for now
var admin = require("firebase-admin");

var serviceAccount = require("./charlies-project-2fcac-firebase-adminsdk-hggn1-b0c290d5fb.json");

admin.initializeApp({
  databaseURL: "https://charlies-project-2fcac.firebaseio.com"
});



function createUser() {
    admin.auth()
      .createUser({
        email: '',
        emailVerified: false,
        password: '',
        userName: '',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
      });
  }
  
  // Call the createUser function
  createUser();