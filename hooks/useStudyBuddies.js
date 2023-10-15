import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFriends, setUserFriends, setUserStudyBuddies } from '../redux/actions/user';
import { friendsListener } from '../services/friends';
import { studyBuddiesListener } from '../services/studyBuddies';
import useUsers from './useUsers';

export const useStudyBuddies = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const { users } = useUsers();
    const handleStudyBuddiesChange = useCallback(
        (change, users) => {

            dispatch(setUserStudyBuddies(change.docs.map(item => {
                const user = users.find(user => user.uid == item.id);
                if (user)
                    return user
            }


            )));



        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = studyBuddiesListener(snapshot => handleStudyBuddiesChange(snapshot, users))
        }

        return () => {
            listener && listener();
        }
    }, [handleStudyBuddiesChange, currentUser, users])

}

