// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_APIKEY_CONFIG,
   authDomain: import.meta.env.VITE_AUTHDOMAIN_CONFIG,
   projectId: import.meta.env.VITE_PROJECTID_CONFIG,
   storageBucket: import.meta.env.VITE_STORAGEBUCKETID_CONFIG,
   messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID_CONFIG ,
   appId:  import.meta.env.VITE_APPID_CONFIG
};

// Initialize Firebase
const firebaseAcademia = initializeApp(firebaseConfig);
export default firebaseAcademia;