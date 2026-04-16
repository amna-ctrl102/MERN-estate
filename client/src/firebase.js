// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-cc685.firebaseapp.com",
  projectId: "mern-estate-cc685",
  storageBucket: "mern-estate-cc685.firebasestorage.app",
  messagingSenderId: "91037024233",
  appId: "1:91037024233:web:ca41fe0ef58fd4e3c29578"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);