import { auth, db } from "../../Firebase/firebase";
import { fetchUser } from "../../services/user";

export const fetchMessages = (id) => (dispatch, getState) => {

    db.collection('chatrooms')

        .doc(id)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .onSnapshot(query => {

            const chatId = id;
            query.docs.forEach(doc => {
                const id = doc.id;
                const data = { id, ...doc.data() };
                const isLiked = data?.likes?.includes(auth.currentUser.uid)
                let user = getState().usersState.users.find(user => user.uid == data.uid);
                if (!user) {
                    fetchUser(data.uid)
                        .then(res => {
                            user = res
                        })
                }

                const message = {
                    ...data,
                    chatId,
                    user,
                    isLiked,
                    likeCount: data?.likes?.length || 0
                };
                dispatch({ type: 'FETCH_MESSAGE', message });


            });



        })




}



export const fetchPinnedMessages = (id) => {
    return ((dispatch) => {
        const chatId = id;

        db.collection('chatrooms')
            .doc(id)
            .collection('messages')

            .where('pinned', '==', true)
            .orderBy("pinnedAt", "asc")
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    const message = { id, ...data };
                    const payload = { id: chatId, message };

                    dispatch({ type: 'PINNED_MESSAGES', payload });

                })
            });
    })

}

