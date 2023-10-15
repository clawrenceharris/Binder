import { unloadAsync } from "expo-font";
import { auth, db } from "../Firebase/firebase";
import firebase from "firebase/compat";
export const burningQuestionsListener = (listener) => {

    db.collection('burning questions')
        .onSnapshot(listener);
}
export const BQAnswersListener = (listener, id) => {

    db.collection('burning questions')
        .doc(id)
        .collection('answers')
        .orderBy('createdAt', 'desc')
        .onSnapshot(listener);
}

export const addBQAnswer = (bq, text) => new Promise((resolve, reject) => {

    db.collection('burning questions')
        .doc(bq.id)
        .collection('answers')
        .add({
            bq,
            text,
            createdAt: new Date().getTime(),
            likes: [],
            uid: auth.currentUser.uid

        })
        .then(resolve)
        .catch(reject);
})

export const addBurningQuestion = (data) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .add({
            ...data,
            createdAt: new Date().getTime(),
            likes: [],
            views: []
        })
        .then((doc) => resolve(doc.id))
        .catch(reject);

})

export const likeBQAnswer = (questionId, answerId, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(questionId)
        .collection('answers')
        .doc(answerId)
        .update({ likes: firebase.firestore.FieldValue.arrayUnion(uid) })
        .then(resolve)
        .catch(reject);

})


export const deleteBQAnswer = (questionId, answerId, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(questionId)
        .collection('answers')
        .doc(answerId)
        .delete()
        .then(resolve)
        .catch(reject);

})
export const unlikeBQAnswer = (questionId, answerId, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(questionId)
        .collection('answers')
        .doc(answerId)
        .update({ likes: firebase.firestore.FieldValue.arrayRemove(uid) })
        .then(resolve)
        .catch(reject);

})
export const likeBurningQuestion = (id, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(id)
        .update({ likes: firebase.firestore.FieldValue.arrayUnion(uid) })
        .then(resolve)
        .catch(reject);

})
export const unlikeBurningQuestion = (id, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(id)
        .update({ likes: firebase.firestore.FieldValue.arrayRemove(uid) })
        .then(resolve)
        .catch(reject);

})
export const fetchBurningQuestion = (id) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(id)
        .get()
        .then((doc) => resolve({ id: doc.id, ...doc.data() }))
        .catch(reject);

})


export const updateBurningQuestion = (id, data) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(id)
        .update(data)
        .then(resolve)
        .catch(reject);

})

export const deleteBurningQuestion = (id) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(id)
        .delete()
        .then(resolve)
        .catch(reject);

})



export const markBQAnswerAsBest = (bqId, answerId) => new Promise((resolve, reject) => {
    unmarkBQAnswerAsBest(bqId)
        .then(() => {
            db.collection('burning questions')
                .doc(bqId)
                .collection('answers')
                .doc(answerId)
                .update({ isBest: true })
                .then(resolve)
                .catch(reject);
        })
        .catch(reject);


})


export const unmarkBQAnswerAsBest = (bqId) => new Promise((resolve, reject) => {
    db.collection('burning questions')
        .doc(bqId)
        .collection('answers')
        .where('isBest', '==', true)
        .get()
        .then((snapshot) => {
            const doc = snapshot.docs[0];
            if (doc)
                doc.ref.update({ isBest: false })
                    .then(resolve)
                    .catch(reject)

            else
                resolve();

        })
        .catch(reject)
})