import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chatsListener, messagesListener } from '../services/chats';
import { fetchUser, userListener } from '../services/user';
import { setChats } from '../redux/actions/chats';

export const useUser = (uid) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [data, setData] = useState(null)

    const handleUserChange = useCallback(
        (change) => {
            if (change.exists)

                setData({ ...change.data() })
        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = userListener(handleUserChange, uid)
        }

        return () => {
            listener && listener();
        }
    }, [handleUserChange, currentUser])


    return { data }
}

