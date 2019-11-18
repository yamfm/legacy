import firebase from 'firebase/app';
import 'firebase/firestore';

if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyDt2t2pzKsyNOrIALlw9ooofylXt3ENmdk",
    authDomain: "yamfm-web.firebaseapp.com",
    databaseURL: "https://yamfm-web.firebaseio.com",
    projectId: "yamfm-web",
    storageBucket: "yamfm-web.appspot.com",
    messagingSenderId: "731139531798",
    appId: "1:731139531798:web:97e73417ba373d5fc2c137",
    measurementId: "G-R3S5LW9Z23"
  };
  firebase.initializeApp(config);
}

const db = firebase.firestore();
export { db };
