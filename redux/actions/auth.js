import firebase from "firebase/compat"
import { auth } from "../../Firebase/firebase"
export const login = (email, password) => dispatch => new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(resolve)
        .catch(reject)
})

export const register = (email, password) => new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(resolve)
        .catch(reject)
})


export const reauthenticate = (currentPassword) => new Promise((resolve, reject) => {
    const user = auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    resolve(user.reauthenticateWithCredential(cred))
})



export const changePassword = (currentPassword, newPassword) => dispatch => new Promise((resolve, reject) => {
    reauthenticate(currentPassword).then(() => {
        const user = auth.currentUser;
        user.updatePassword(newPassword)
            .then(resolve)
            .catch(reject);
    })
})
export const changeEmail = (currentPassword, newEmail) => dispatch => new Promise((resolve, reject) => {
    reauthenticate(currentPassword)
        .then(() => {
            const user = auth.currentUser;
            user.updateEmail(newEmail)
                .then(() => {
                    console.log("Email updated!");
                })
                .catch(reject);
        })
})


