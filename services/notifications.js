import { auth, db } from "../Firebase/firebase";


export const addNotification = (recipientId, senderId, title, message, type = null, navigation = null) =>
    new Promise(async (resolve, reject) => {
        db.collection('users')
            .doc(recipientId)
            .collection('notifications')
            .add({
                senderId,
                recipientId,
                title,
                message,
                isSeen: false,
                type,
                createdAt: new Date().getTime(),
                navigation


            })
            .then(resolve)
            .catch(reject)
    })

export const notificationsListener = (listener) => {
    db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .onSnapshot(listener);
}
export const deleteNotification = (id) =>
    new Promise(async (resolve, reject) => {
        const usersRef = db.collection('users')

        const notificationsRef = usersRef.doc(auth.currentUser.uid).collection('notifications')
        const notificationsDoc = notificationsRef.doc(id)
        notificationsDoc.delete()
            .then(resolve)
            .catch(reject)
    })

export const updateNotification = (id, data) => {
    db.collection('users')
        .doc(auth.currentUser.uid)
        .collection('notifications')
        .doc(id)
        .update(data)
}