
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("./charlies-project-2fcac-firebase-adminsdk-hggn1-b0c290d5fb.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/* admin.initializeApp({
  databaseURL: "https://charlies-project-2fcac.firebaseio.com"
}); */

const { checkForUser } = require('./adminFunctions');

const db = admin.firestore(); 
const app = express();
const port = 4000;

app.use(express.json());

app.post('/checkUser', async (req, res) => {
  const { username, email } = req.body;
  console.log(username); 
  console.log(email); 
  
  try {
    const result = await checkForUser(username, email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "issue running checkForUser" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});






// ignore for now
/* const storage = new Storage(); */
// Creates a client from a Google service account key
// const storage = new Storage({keyFilename: 'key.json'});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

/* 
async function createBucket() {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}

createBucket().catch(console.error);
*/

/**
 * Initiate a recursive delete of documents at a given path.
 * 
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 * 
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 * 
 * @param {string} data.path the document or collection path to delete.
 */

/* 
 exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall(async (data, context) => {
    // Only allow admin users to execute this function.
    if (!(context.auth && context.auth.token && context.auth.token.admin)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.'
      );
    }

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    await firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        force: true,
        token: functions.config().fb.token
      });

    return {
      path: path 
    };
  });
*/