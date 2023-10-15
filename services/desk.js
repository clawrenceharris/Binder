import { auth, db } from '../Firebase/firebase'
import firebase from 'firebase/compat'


export const createDesk = (uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(uid)
        .set({
            isPublic: false,
            likes: 0,
            views: 0,
        })
        .then(resolve)
        .catch(reject)
})

export const deskListener = (listener, deskId) => {
    db.collection('desks')
        .doc(deskId)
        .onSnapshot(listener);
}


export const desksListener = (listener, deskId) => {
    db.collection('desks')
        .doc(deskId)
        .onSnapshot(listener);
}


export const deskItemsListener = (listener, deskId) => {
    if (deskId) {
        db.collection('desks')
            .doc(deskId)
            .collection('desk items')
            .orderBy('createdAt', 'asc')
            .onSnapshot(listener);
    }
    else {
        db.collectionGroup('desk items')
            .where('showInExplore', '==', true)
            .onSnapshot(listener);
    }



}


export const sharedDeskItemsListener = (listener, deskId) => {

    db.collection('desks')
        .doc(deskId)
        .collection('shared items')
        .onSnapshot(listener);




}

export const usersDeskItemsListener = (listener) => {

    db.collectionGroup('desk items')
        .onSnapshot(listener);




}

export const deleteSharedDeskItem = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('shared items')
        .doc(id)
        .delete()
        .then(resolve)
        .catch(reject);

})


export const getSharedItemById = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('shared items')
        .doc(id)
        .get()
        .then(doc => resolve(doc.exists))
        .catch(reject);
})


export const addSharedDeskItem = (id, deskId) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('shared items')
        .doc(id)
        .set({ deskItemRef: db.collection('desks').doc(deskId).collection('desk items').doc(id) })
        .then(resolve)
        .catch(reject);
})


export const bookmarkDeskItem = (deskId, id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('bookmarked items')
        .doc(id)
        .set({ deskItemRef: db.collection('desks').doc(deskId).collection('desk items').doc(id) })
        .then(resolve)
        .catch(reject);
})


export const unbookmarkDeskItem = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('bookmarked items')
        .doc(id)
        .delete()
        .then(resolve)
        .catch(reject);
})

export const getBookmarkedItemById = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('bookmarked items')
        .doc(id)
        .get()
        .then(doc => resolve(doc.exists))
        .catch(reject);
})



export const bookmarkedItemsListener = (listener, deskId) => {

    db.collection('desks')
        .doc(deskId)
        .collection('bookmarked items')
        .onSnapshot(listener)


}

export const postDeskItem = (data) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('desk items')
        .add({
            ...data,
            createdAt: new Date().getTime(),
            views: [],
            likes: [],
        })
        .then((doc) => resolve(doc.id))
        .catch(reject);



})
export const fetchDesk = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(id)
        .get()
        .then(doc => {
            if (doc.data().isPublic) {
                const id = doc.id;
                const data = doc.data();
                const desk = { id, ...data };

                resolve(desk);
            }


        });
})

export const isDeskPublic = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(id)
        .get()
        .then(doc => {
            resolve(doc.data().isPublic)
        })
        .catch(reject);

})


export const fetchDeskItems = (id) => new Promise((resolve, reject) => {

    db.collection('desks')
        .doc(id)
        .collection('desk items')
        .onSnapshot(query => {
            const deskItems = query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return { id, ...data };

            })
            resolve(deskItems);
        })
        .catch(reject);

})

export const acceptDeskRequest = (senderId, recipientId) =>
    new Promise(async (resolve, reject) => {
        db.collection('desk requests')

            .where('senderId', '==', senderId)
            .where('recipientId', '==', recipientId)

            .get()
            .then(query => {
                const doc = query.docs[0];
                doc.ref.update({
                    status: 'accepted'
                }).then(resolve)
            })
            .catch(reject);
    });

export const deleteDeskRequest = (senderId, recipientId) =>
    new Promise(async (resolve, reject) => {
        const deskRequestRef = db.collection('desk requests')
        const deskRef = db.collection('desk')
        // Update the status field in the friend requests collection
        const querySnapshot = await deskRequestRef
            .where('senderId', '==', senderId)
            .where('recipientId', '==', recipientId)
            .get();
        const deskRequestDoc = querySnapshot.docs[0];
        await deskRequestDoc.ref.delete()
            .then(resolve)
            .catch(reject);
    });


export const getDeskRequestStatus = (senderId, recipientId) =>
    new Promise((resolve, reject) => {

        db.collection('desk requests')
            .where('senderId', '==', senderId)
            .where('recipientId', '==', recipientId)
            .get()
            .then(snapshot => {
                const deskRequestDoc = snapshot.docs[0]
                if (deskRequestDoc)
                    resolve(deskRequestDoc.data().status)
                else {
                    resolve('null')
                }
            })
            .catch(reject);
    });


export const sendDeskRequest = (senderId, recipientId) =>
    new Promise((resolve, reject) => {
        db.collection('desk requests')
            .add({
                senderId,
                recipientId,
                status: 'pending',
            })
            .then(resolve)
            .catch(reject);
    });
export const deleteUserDeskItem = (id) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('desk items')
        .doc(id)
        .delete()
        .then(resolve)
        .catch(reject);
});



export const updateDeskItem = (id, data, deskId = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(deskId)
        .collection('desk items')
        .doc(id)
        .update(data)
        .then(resolve)
        .catch(reject);



});

export const likeDeskItem = (id, deskId = auth.currentUser.uid, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {

    db.collection('desks')
        .doc(deskId)
        .collection('desk items')
        .doc(id)
        .update({ likes: firebase.firestore.FieldValue.arrayUnion(uid) })
        .then(() => updateDesk(deskId, { likes: firebase.firestore.FieldValue.increment(1) }))
        .then(resolve)
        .catch(reject);

});

export const unlikeDeskItem = (id, deskId = auth.currentUser.uid, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {


    db.collection('desks')
        .doc(deskId)
        .collection('desk items')
        .doc(id)
        .update({ likes: firebase.firestore.FieldValue.arrayRemove(uid) })
        .then(() => updateDesk(deskId, { likes: firebase.firestore.FieldValue.increment(-1) }))

        .then(resolve)
        .catch(reject);





});




export const updateDesk = (deskId, data) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(deskId)
        .update(data)
        .then(resolve)
        .catch(reject);



});

export const fetchDeskItem = (id, deskId = auth.currentUser.uid) => new Promise((resolve, reject) => {

    db.collectionGroup('desk items')
        .get()
        .then((snapshot) => {
            const doc = snapshot.docs.find(doc => doc.id == id);
            if (doc.exists) {
                const data = doc.data();
                const id = doc.id;
                resolve({ id, ...data })

            }
            else {
                resolve(null);
            }
        })

        .catch(reject);



});





export const updateDeskItemViews = (deskId, id, currentViewState, uid = auth.currentUser.uid,) => new Promise((resolve, reject) => {
    if (!currentViewState) {
        db.collection('desks')
            .doc(deskId)
            .collection('desk items')
            .doc(id)
            .update({ views: firebase.firestore.FieldValue.arrayUnion(uid) })
            .then(() => updateDesk(deskId, { views: firebase.firestore.FieldValue.increment(1) }))
            .catch(reject);

    }
    else {
        resolve();
    }



});

export const getViewById = (deskId, id, uid) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(deskId)
        .collection('desk items')
        .doc(id)
        .collection('views')
        .doc(uid)
        .get()
        .then((res) => resolve(res.exists))
        .catch(reject);

});

export const updateDeskItemComments = (deskId, id, data) => new Promise((resolve, reject) => {
    db.collection('desks')
        .doc(deskId)
        .collection('desk item')
        .doc(id)
        .collection('comments')
        .add(data)
        .then(resolve)
        .catch(reject);

});





