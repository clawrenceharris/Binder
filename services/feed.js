import { db } from "../Firebase/firebase"

export const fetchPostComments = (chatroomId, postId) => new Promise((resolve, reject) => {
    db.collection('feed')
        .doc(postId)
        .collection('comments')
        .get()
        .then(query => {
            const comments = query.docs.map(doc => {
                const id = doc.id
                const data = doc.data()
                return { id, ...data }
            })

            resolve(comments)
        })
        .catch(reject)

})

export const fetchFeed = (chatroomId) => new Promise((resolve, reject) => {
    db
        .collection('feed')
        .get()
        .then(query => {
            let posts = query.docs.map((doc) => {
                const id = doc.id
                const data = doc.data()
                return { id, ...data }

            })
            resolve(posts)
        })
})


export const addPost = (data) => new Promise((resolve, reject) => {

    db.collection('feed')
        .add(data)
        .then(resolve)
        .catch(reject);

})
