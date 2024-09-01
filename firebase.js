// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqbTJ96855Cmgvev2A1YnXPMN87dnmjNQ",
  authDomain: "pantrynomenon.firebaseapp.com",
  projectId: "pantrynomenon",
  storageBucket: "pantrynomenon.appspot.com",
  messagingSenderId: "788567667043",
  appId: "1:788567667043:web:da0e16ebf4b1ae08eaa356",
  measurementId: "G-PTSV03M1E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);