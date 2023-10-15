
import { auth, db } from "../Firebase/firebase";

export const studyBuddiesListener = (listener) => {


    db.collection('study buddies')
        .doc(auth.currentUser.uid)
        .collection('user study buddies')
        .onSnapshot(listener);



}


export const removeStudyBuddy = (uid) =>
    new Promise(async (resolve, reject) => {
        db.collection('study buddies')
            .doc(auth.currentUser.uid)
            .collection('user study buddies')
            .doc(uid)
            .delete()
            .then(resolve)
            .catch(reject);



    })
export const addStudyBuddy = (uid) =>
    new Promise(async (resolve, reject) => {
        db.collection('study buddies')
            .doc(auth.currentUser.uid)
            .collection('user study buddies')
            .doc(uid)
            .set({})
            .then(resolve)
            .catch(reject);



    })