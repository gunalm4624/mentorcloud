
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlZYrbPBfgl9S0gmSlXMBYt6O_S3dbbg8",
  authDomain: "prism-lms-7df81.firebaseapp.com",
  projectId: "prism-lms-7df81",
  storageBucket: "prism-lms-7df81.firebasestorage.app",
  messagingSenderId: "1012378619676",
  appId: "1:1012378619676:web:8f7e17ce1fecc0d47174d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
