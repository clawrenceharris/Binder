import { View, Text } from 'react-native'
import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chatsListener } from '../services/chats';
import { usersListener } from '../services/user';
const useUsers = () => {



    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [users, setUsers] = useState([]);
    const handleUsersChange = useCallback(
        (change) => {

            setUsers(change.docs.map(item => ({ ...item.data() })).concat(currentUser))

        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = usersListener(handleUsersChange)
        }

        return () => {
            listener && listener();
        }
    }, [handleUsersChange, currentUser])


    return { users }
}

export default useUsers