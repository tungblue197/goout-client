// Import the functions you need from the SDKs you need
import { initializeApp, } from 'firebase/app';
import { getAuth, GoogleAuthProvider , signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnr8zg7MWKMxrmOQW7OEUs6RiGKuOxmpg",
  authDomain: "goouttogether-v2.firebaseapp.com",
  projectId: "goouttogether-v2",
  storageBucket: "goouttogether-v2.appspot.com",
  messagingSenderId: "845177106011",
  appId: "1:845177106011:web:f5e9cb9ea65e5f1792997e",
  measurementId: "G-L12S9SK8Q8"
};
export default initializeApp(firebaseConfig);
export const auth = getAuth();
auth.languageCode = 'vi';
export const googleAuthProvider = new GoogleAuthProvider();

export const loginWithGoogle = (cb: (user: any, err:any) => void) => {
  signInWithPopup(auth, googleAuthProvider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if(!credential) return;
    const token = credential.accessToken;
    const user = result.user;
    cb(user, undefined);
  }).catch(err => {
    cb(undefined, err);
  })
}
// Initialize Firebase


