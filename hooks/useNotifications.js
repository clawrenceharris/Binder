import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { messagesListener } from '../services/chats';
import { fetchUser } from '../services/user';
import { notificationsListener } from '../services/notifications';
import { setNotifications } from '../redux/actions/notifications';

export const useNotifications = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);

    const handleNotificationsChange = useCallback(
        (change) => {
            const notifications = change.docs.map(item => ({ id: item.id, ...item.data() }));
            if (notifications)
                dispatch(setNotifications(notifications))
        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = notificationsListener(handleNotificationsChange)
        }

        return () => {
            listener && listener();
        }
    }, [handleNotificationsChange, currentUser])

}

