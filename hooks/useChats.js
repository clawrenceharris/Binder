import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chatsListener } from '../services/chats';
import { setChats } from '../redux/actions/chats';
import useUsers from './useUsers';
import { auth } from '../Firebase/firebase';

export const useChats = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const { users } = useUsers();
    const handleChatsChange = useCallback(
        (change, users) => {

            dispatch(setChats(change.docs.map(item => {
                const user = users.find(user => user?.uid == item.data().users.find(uid => uid != auth.currentUser.uid));

                return { id: item.id, user: item.data().type == 'private' ? user : null, ...item.data() }

            })))
        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = chatsListener(snapshot => handleChatsChange(snapshot, users))
        }

        return () => {
            listener && listener();
        }
    }, [handleChatsChange, currentUser, users])
}

