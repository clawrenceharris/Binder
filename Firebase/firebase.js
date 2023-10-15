import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import 'firebase/compat/firestore';
import { getStorage, ref } from 'firebase/storage'
import { StorageReference } from 'firebase/storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'

var firebaseConfig = {

    apiKey: "AIzaSyBI5SBqfoI_4on8BXUhVgeLmtjMhrdijzM",
    authDomain: "binder-b38fd.firebaseapp.com",
    projectId: "binder-b38fd",
    storageBucket: "binder-b38fd.appspot.com",
    messagingSenderId: "769307324915",
    appId: "1:769307324915:web:22ea662cb9fc0a6f602286",
    measurementId: "G-VF1PD1RCC2"


}

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)

}
else {
    app = firebase.app()
}
const db = app.firestore()
const storage = getStorage(app)
const auth = firebase.auth()












export { db, auth, storage }

