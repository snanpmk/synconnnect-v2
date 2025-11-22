// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcBK9le_IAbhb43aLWKbKKZ2WCM0FiAF4",
  authDomain: "synconnect-1526.firebaseapp.com",
  projectId: "synconnect-1526",
  storageBucket: "synconnect-1526.appspot.com",
  messagingSenderId: "810533595227",
  appId: "1:810533595227:web:28f107e23c79008579f77e",
  measurementId: "G-SJG9Y4BT07",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
