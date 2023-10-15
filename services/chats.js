import { auth, db } from "../Firebase/firebase"
import firebase from 'firebase/compat/app'
import { capitalize } from "../utils"


export const chatsListener = (listener) => {
    db.collection('chatrooms')
        .where('users', 'array-contains', auth.currentUser.uid)
        .onSnapshot(listener)
}


export const messagesListener = (listener, chatId) => {
    db.collection('chatrooms')
        .doc(chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(listener)
}




export const updateMessage = (chatId, messageId, data) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .update(data)
        .then(resolve)
        .catch(reject)
})


export const leaveChat = (id) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .doc(id)
        .update({ users: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid) })
        .then(resolve)
        .catch(reject);
});


export const fetchChat = (id) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .doc(id)
        .get()
        .then(doc => {
            const id = doc.id;
            const data = doc.data();
            const chat = { id, ...data };
            resolve(chat);
        })
        .catch(reject);

});

export const fetchUserChats = () => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .where('users', 'array-contains', auth.currentUser.uid)
        .orderBy('recentActivity.createdAt', 'desc')
        .onSnapshot(query => {
            const chats = query.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                const chat = { id, ...data };

                return chat
            });
            resolve(chats);




        })


});

export const updateChat = (id, data) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .doc(id)

        .update({
            ...data
        })
        .then(resolve)
        .catch(reject);

});




export const getSharedChats = (uid) => new Promise((resolve, reject) => {
    if (uid) {
        db.collection('chatrooms')
            .where('users', 'array-contains', uid)
            .where('type', '!=', 'private')
            .get()
            .then(query => {
                const chats = query.docs
                    .filter(doc => doc.data().users.includes(auth.currentUser.uid))
                    .map(doc => {
                        const id = doc.id;
                        const data = doc.data();
                        return { id, ...data }
                    });
                resolve(chats);

            })
            .catch(reject);
    }
    else {
        reject("id is undefined");
    }

});

export const updateRecentActivity = (chatroomId, content, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {


    db.collection('chatrooms')
        .doc(chatroomId)
        .update({
            recentActivity: {
                content,
                uid,
                createdAt: new Date().getTime()

            }
        })
        .then(resolve)
        .catch(reject);
});


export const addSystemMessage = (id, uid, text) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .doc(id)
        .collection('messages')
        .add({
            uid,
            text,
            isSystem: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        .then(resolve)
        .catch(reject)
})

export const sendMessage = (
    id,
    contentType,
    text = "",
    media = null,
    specialChatItem = null,
    doc = null,
    replyToMessage = null,
    isSystem = false,
    uid = auth.currentUser.uid,



) => new Promise((resolve, reject) => {
    const message = { contentType, text, media, specialChatItem, isSystem }

    db.collection('chatrooms')
        .doc(id)
        .collection('messages')
        .add({
            ...message,

            pinned: false,
            uid,
            replyToMessage,
            likes: [],
            doc,
            createdAt: new Date().getTime()

        })
        .then((doc) => resolve(doc.id))
        .then(() => updateRecentActivity(id, getLastMessage(message), uid))
        .catch(reject);
})


export const deleteMessage = (chatId, messageId) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .delete()
        .then(resolve)
        .catch(reject)
})

export const fetchMessages = (id) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .doc(id)
        .collection('messages')
        .get()
        .then(snapshot => {
            const messages = snapshot.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return { id, ...data };
            })
            const sortedMessages = messages.filter(item => item.pinned == false)
                .sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
                .concat(messages.filter(item => item.pinned == true).sort((a, b) => a.pinnedAt > b.pinnedAt ? 1 : -1))
            resolve(sortedMessages);
        });

})


export const updateMessageLikes = (currentLikeState, chatId, messageId) => new Promise((resolve, reject) => {


    if (currentLikeState == true) {
        db.collection('chatrooms')
            .doc(chatId)
            .collection('messages')
            .doc(messageId)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
            })
    }
    else {
        db.collection('chatrooms')
            .doc(chatId)
            .collection('messages')
            .doc(messageId)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)

            })

    }

})
export const fetchPinnedMessages = (id) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .doc(id)
        .collection('messages')

        .where('pinned', '==', true)
        .orderBy("pinnedAt", "asc")
        .get()
        .then(snapshot => {
            const messages = snapshot.docs.map(doc => {
                const id = doc.id;
                const data = doc.data();
                return { id, ...data };
            })
            resolve(messages);
        });

})
export const pinMessage = (chatId, messageId) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .update({ pinned: true, pinnedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(resolve)
        .catch(reject)

})


export const unpinMessage = (chatId, messageId) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .update({ pinned: false })
        .then(resolve)
        .catch(reject)

})


export const getChatByUid = (uid) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .where('users', 'array-contains', uid)
        .where('type', '==', 'private')
        .get()
        .then(snapshot => {
            const doc = snapshot.docs[0];


            if (doc && doc.data().users.includes(auth.currentUser.uid)) {
                const id = doc.id;
                const data = doc.data();
                const chat = { id, ...data };
                resolve(chat);
            }
            else {
                resolve(null);
            }


        })
        .catch(reject);
});

export const getChatByUids = (uids) => new Promise((resolve, reject) => {

    db.collection('chatrooms')
        .where('users', 'array-contains', auth.currentUser.uid)
        .get()
        .then(snapshot => {

            const doc = snapshot.docs.find(doc => {
                const data = doc.data();
                return data.users.every(el => uids.includes(el)) && uids.length == data.users.length
            });


            if (doc) {
                const id = doc.id;
                const data = doc.data();
                const chat = { id, ...data };
                return resolve(chat);

            }





            resolve(null);


        })
        .catch(reject);
});


export const addUserToChat = (id, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .doc(id)
        .get()
        .then((doc) => {
            if (doc.exists) {
                doc.ref.update({ users: firebase.firestore.FieldValue.arrayUnion(uid) })
                    .then(resolve)
                    .catch(reject)
            }
            else {
                resolve()
            }
        })

        .catch(reject)
})

export const removeUserFromChat = (id, uid = auth.currentUser.uid) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .doc(id)
        .get()
        .then((doc) => {
            if (doc.exists) {
                doc.ref.update({ users: firebase.firestore.FieldValue.arrayRemove(uid) })
                    .then(resolve)
                    .catch(reject)
            }
            else {
                resolve()
            }
        })

        .catch(reject)
})

export const createChat = (data) => new Promise((resolve, reject) => {
    db.collection('chatrooms')
        .add({
            ...data,
            creator: auth.currentUser.uid,
            createdAt: new Date().getTime(),
            recentActivity: {
                content: "created the " + data.type,
                uid: auth.currentUser.uid,
                createdAt: new Date().getTime()
            }
        })
        .then(doc => {
            const id = doc.id;
            resolve(id);
        })
        .catch(reject);
});


export const getLastMessage = (message) => {

    switch (message.contentType) {
        case 'deleted message': return ' deleted a message.s'
        case 'text': return message.isSystem ? message.text : 'sent ' + message.text;
        case 'burning question': return 'sent a Burning Question';
        case 'poll': return 'sent a poll';
        case 'desk item': return message.specialChatItem.type[message.specialChatItem.type.length - 1] == 's' ?
            'sent ' + message.specialChatItem.typ :
            'sent a ' + message.specialChatItem.type;
        case 'Study Guide': return 'sent a Study Guide';
        case 'Game': return 'sent a Game';
        case 'Other': return 'sent a Desk item';
        case 'clip': return 'sent a clip';
        case 'video': return 'sent a video';
        case 'photo': return 'sent a photo';
        case 'bq answer': return 'sent a Burning Question answer'
        default: return 'sent a message'

    }
}

