// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB04PuTslc3ry8oB8bXdLF7dhdY7TMwtrM",
  authDomain: "busybuy-app-d82a8.firebaseapp.com",
  projectId: "busybuy-app-d82a8",
  storageBucket: "busybuy-app-d82a8.appspot.com",
  messagingSenderId: "701928866214",
  appId: "1:701928866214:web:0618d5e31d110436d44f67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);