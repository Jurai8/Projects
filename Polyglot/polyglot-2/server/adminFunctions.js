
const admin = require("firebase-admin");
const db = admin.firestore();

async function checkForUser(username, email) {
  // Check if email is being used
  const emailQuery = db.collection("Users").where("email", "==", email);
  const emailSnapshot = await emailQuery.get();

  // Check if username is being used
  const usernameQuery = db.collection("Users").where("Username", "==", username);
  const usernameSnapshot = await usernameQuery.get();

  if (!emailSnapshot.empty) {
      return {
          status: "error",
          message: "User with this email exists"
      }; 
  } else if (!usernameSnapshot.empty) {
      return {
          status: "error",
          message: "This username is being used"
      };
  } else {
    return{
        status: "success",
        message: "User does not exist"
    }
  }
}

module.exports = { checkForUser };