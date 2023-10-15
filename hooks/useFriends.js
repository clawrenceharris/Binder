import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFriends, setUserFriends } from '../redux/actions/user';
import { friendsListener } from '../services/friends';

export const useFriends = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const users = useSelector(state => state.usersState.users);
    const handleFriendsChange = useCallback(
        (change, users) => {

            dispatch(setUserFriends(change.docs.map(item => {
                const user = users.find(user => user.uid == item.id);
                return user
            }


            )));



        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = friendsListener(snapshot => handleFriendsChange(snapshot, users))
        }

        return () => {
            listener && listener();
        }
    }, [handleFriendsChange, currentUser, users])

}

