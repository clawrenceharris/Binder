import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { messagesListener } from '../services/chats';
import { fetchUser } from '../services/user';
import { fetchUsersData } from '../redux/actions/user';
import useUsers from './useUsers';

export const useMessages = (chatId) => {
    const [messages, setMessages] = useState([])
    const currentUser = useSelector(state => state.userState.currentUser);
    const [lastMessage, setLastMessage] = useState(null)
    const { users } = useUsers();

    const handleMessagesChange = useCallback(
        (snapshot, users) => {

            const messages = snapshot.docs.map(item => {


                const user = users.find(user => user.uid == item.data().uid);
                return { id: item.id, ...item.data(), user }

            })
            setLastMessage(messages.length > 0 ? messages[messages.length - 1] : null)

            //set the messsages pushing the pinned messages to the end of the array
            setMessages(messages.filter(item => item.pinned == false)
                .sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
                .concat(messages.filter(item => item.pinned == true).sort((a, b) => a.pinnedAt > b.pinnedAt ? 1 : -1)))


        },
        [chatId],
    )

    useEffect(() => {
        let listener;

        if (currentUser && chatId) {

            listener = messagesListener((snapshot) => handleMessagesChange(snapshot, users), chatId)
        }

        return () => {
            listener && listener();
        }
    }, [handleMessagesChange, currentUser, users, chatId])

    return { messages, lastMessage }
}

