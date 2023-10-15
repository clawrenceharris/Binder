import { auth, db } from "../Firebase/firebase"
import { createDesk } from "./desk"

export const getUserClasses = (uid) =>
    new Promise((resolve, reject) => {
        db.collection('users')
            .doc(uid)
            .collection('chatrooms')
            .get()
            .then((query) => {
                const classes = query.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    if (data.type == 'class')
                        return { id, ...data }
                })
                resolve(classes)
            })
            .catch(reject)

    })


export const usersListener = (listener) => {
    db.collection('users')
        .onSnapshot(listener);
}
export const isEmailInUse = (email) => new Promise((resolve, reject) => {
    db.collection('users')
        .where('email', '==', email)
        .get()
        .then(query => {
            resolve(query.docs.length > 0)

        })
        .catch(reject);
})

export const createUser = (uid, username, displayName, photoURL, birthday, email, schoolId) => new Promise((resolve, reject) => {
    db.collection('users')
        .doc(uid)
        .set({
            uid,
            username,
            displayName,
            photoURL: photoURL || null,
            birthday,
            email,
            schoolId,
            friends: [],
            studyBuddies: [],
            photos: []

        })
        .then(createDesk)
        .catch(reject)
})


export const userListener = (listener, uid) => {

    db.collection('users')
        .doc(uid)
        .onSnapshot(listener)
}



export const fetchUser = (uid) =>
    new Promise((resolve, reject) => {

        db.collection('users')
            .doc(uid)
            .get()
            .then(doc => {
                const user = doc.data();

                resolve(user);



            }).catch(reject)
    })



export const getUserGroupchats = (uid) =>
    new Promise((resolve, reject) => {
        db.collection('users')
            .doc(uid)
            .collection('chatrooms')
            .get()
            .then((query) => {
                const classes = query.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    if (data.type == 'group')
                        return { id, ...data }
                })
                resolve(classes)
            })
            .catch(reject)

    })

export const getUserSchools = (uid) =>
    new Promise((resolve, reject) => {
        db.collection('users')
            .doc(uid)
            .collection('chatrooms')
            .get()
            .then((query) => {
                const classes = query.docs.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    if (data.type == 'school')
                        return { id, ...data }
                })
                resolve(classes)
            })
            .catch(reject)

    })




export const updateUser = (data, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('users')
        .doc(uid)
        .update(data)
        .then(resolve)
        .catch(reject)

})

export const deleteUser = () =>
    new Promise((resolve, reject) => {
        db.collection('users')
            .doc(auth.currentUser.uid)
            .delete()
            .then(resolve)
            .catch(reject)
    })


export const getUserFriends = (uid) =>
    new Promise((resolve, reject) => {

        db.collection('users')
            .doc(uid)
            .collection('friends')
            .get()
            .then(query => {
                const friends = query.docs.map(doc => {
                    const id = doc.id;
                    const data = doc.data()
                    return { id, ...data }
                })
                resolve(friends)
            })
            .then(resolve)
            .catch(reject)

    })







