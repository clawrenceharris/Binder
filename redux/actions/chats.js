import { fetchUsersData } from ".";
import { auth, db } from "../../Firebase/firebase";
import { useMessages } from "../../hooks/useMessages";
import { fetchUser } from "../../services/user";
import { fetchMessages } from "./messages";



export const setChats = chats => dispatch => dispatch({ chats, type: 'FETCH_USER_CHATS' })

export const fetchChats = () => (dispatch) => {

    db.collection('chatrooms')
        .where('isPublic', '==', true)
        .onSnapshot(query => {

            const chats = query.docs.map(doc => {
                if (doc.exists) {
                    const id = doc.id;
                    const data = doc.data();
                    return { id, ...data };
                }


            });

            dispatch({ type: 'FETCH_CHATS', chats });


        });



}


export const fetchUserChats = () => (dispatch, getState) => {
    const currentUser = getState().userState.currentUser;
    const users = getState().usersState.users;

    if (currentUser) {

        db.collection('chatrooms')
            .where('users', 'array-contains', auth.currentUser.uid)
            .orderBy('recentActivity.createdAt', 'desc')
            .onSnapshot(query => {

                const chats = query.docs.map(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    const otherUid = data.users.find(uid => uid != auth.currentUser.uid);
                    let user = users.find(user => user.uid == otherUid);
                    if (!user) {
                        fetchUser(otherUid)
                            .then(res => user = res)
                    }
                    return { id, user, ...data };
                });


                dispatch({ type: 'FETCH_USER_CHATS', chats })


            })
    }



}







