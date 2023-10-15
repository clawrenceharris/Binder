import { db } from "../Firebase/firebase"

export const getLikeById = (postId, uid) => new Promise((resolve, reject) => {
    db
        .collection('feed')
        .doc(postId)
        .collection('likes')
        .doc(uid)
        .get()
        .then(res => resolve(res.exists))
        .catch(reject)

})


export const updateLike = (postId, commentId, uid, currentLikeState) => new Promise((resolve, reject) => {
    if (currentLikeState) {
        db
            .collection('feed')
            .doc(postId)
            .collection('comments')
            .doc(commentId)
            .collection('likes')
            .doc(uid)
            .delete()
            .then(resolve)
            .catch(reject)

    }
    else {
        db
            .collection('feed')
            .doc(postId)
            .collection('likes')
            .doc(uid)
            .set({})
            .then(resolve)
            .catch(reject)


    }


})

