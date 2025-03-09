// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmgGSHVNxMpf8hEhXsBWwZCp5Fd9O0Z-Y",
  authDomain: "academiareact-c1010.firebaseapp.com",
  projectId: "academiareact-c1010",
  storageBucket: "academiareact-c1010.firebasestorage.app",
  messagingSenderId: "228337563685",
  appId:  "1:228337563685:web:1a71c706db3be51e00e7cc",
};

// Initialize Firebase
const firebaseAcademia = initializeApp(firebaseConfig);
export default firebaseAcademia;