import firebaseAcademia from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth(firebaseAcademia);

export const singinUser=(email,password)=>{
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    console.log(userCredential)
    // ...
  })
  .catch((error) => {
   console.log(error)
  });
};
export const logoutFirebase= () =>{
    signOut(auth)
    .then (() =>{
        console.log('cerro sesion');

    })
    .catch((error)=>{
        console.log(error);
    })

};

export const userListener = (listener) =>{
    onAuthStateChanged(auth,(user)=>{
        listener(user)
    })
}