import firebase from 'firebase/compat'

export const getMedia = (data) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('desk items')
        .add({ ...data })
        .then(resolve)

        .catch((e) => {
            reject(e)
            console.log(e)
        })




})

export const saveMediaToStorage = (media, path) => new Promise((resolve, reject) => {
    const fileRef = firebase.storage().ref().child(path)

    fetch(media)
        .then(response => response.blob())
        .then(blob => fileRef.put(blob))
        .then(task => task.ref.getDownloadURL())
        .then(downloadUrl => resolve(downloadUrl))
        .catch(reject)


})


