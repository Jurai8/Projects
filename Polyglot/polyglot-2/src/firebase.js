import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7yhna5--zjgQHFuLTVvps4ZR82zoh_pM",
  authDomain: "charlies-project-2fcac.firebaseapp.com",
  databaseURL: "https://charlies-project-2fcac.firebaseio.com",
  projectId: "charlies-project-2fcac",
  storageBucket: "charlies-project-2fcac.appspot.com",
  messagingSenderId: "871811973657",
  appId: "1:871811973657:web:01d43adeb98d609826e088",
  measurementId: "G-WXSBNZDZG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export const firestore =  getFirestore(app);
