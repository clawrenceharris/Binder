import { auth, db } from "../Firebase/firebase"
import firebase from 'firebase/compat'


export const updateFriends = (uid, currentFriendState) =>
    new Promise((resolve, reject) => {
        if (!currentFriendState) {
            db.collection('users')
                .doc(auth.currentUser.uid)
                .update({
                    friends: firebase.firestore.FieldValue.arrayUnion(uid)
                })

                .then(resolve)
                .catch(reject)



        }
        else {
            db.collection('users')
                .doc(auth.currentUser.uid)
                .update({
                    friends: firebase.firestore.FieldValue.arrayRemove(uid)
                })
                .then(resolve)
                .catch(reject)




        }


    })


export const addFriend = (uid) =>
    new Promise(async (resolve, reject) => {


        db.collection('friends')
            .doc(auth.currentUser.uid)
            .collection('user friends')
            .doc(uid)
            .set({})
            .then(resolve)
            .catch(reject);


    })


export const friendsListener = (listener) => {


    db.collection('friends')
        .doc(auth.currentUser.uid)
        .collection('user friends')
        .onSnapshot(listener);



}


export const unAddFriend = (uid) =>
    new Promise(async (resolve, reject) => {
        db.collection('friends')
            .doc(auth.currentUser.uid)
            .collection('user friends')
            .doc(uid)
            .delete()
            .then(resolve)
            .catch(reject);



    })

export const acceptFriendRequest = (senderId, recipientId) =>
    new Promise(async (resolve, reject) => {
        const friendRequestsRef = db.collection('friend requests')
        const usersRef = db.collection('users')

        //query for the docs that match the sender's id and the recipient's id
        const querySnapshot = await friendRequestsRef
            .where('senderId', '==', senderId)
            .where('recipientId', '==', recipientId)
            .get();

        const friendRequestDoc = querySnapshot.docs[0];
        //update the documents status field to accepted
        await friendRequestDoc.ref.update({ status: 'accepted' })
            .then(async () => {
                // Add both users' IDs to each other's friends arrays
                await usersRef.doc(senderId).update({
                    friends: firebase.firestore.FieldValue.arrayUnion(recipientId),
                })
                    .then(async () => {
                        await usersRef.doc(recipientId).update({
                            friends: firebase.firestore.FieldValue.arrayUnion(senderId),
                        })
                            .catch(reject);
                    })
                    .then(resolve)
                    .catch(reject);




            })
            .catch(reject);




    })




export const sendFriendRequest = (senderId, recipientId) =>
    new Promise(async (resolve, reject) => {
        const friendRequestsRef = db.collection('friend requests')

        await friendRequestsRef.add({
            senderId,
            recipientId,
            status: 'pending',
        })
            .then(resolve)
            .catch(reject);
    })