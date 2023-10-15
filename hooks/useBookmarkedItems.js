import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bookmarkedItemsListener } from '../services/desk';

export const useBookmarkedItems = (id) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [bookmarkedItemRefs, setBookmarkedItemRefs] = useState([])

    const handleBookmarkedItemsChange = useCallback(
        (change) => {
            setBookmarkedItemRefs(change.docs.map(item => (item.data().deskItemRef)));


        },
        [dispatch],
    )


    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = bookmarkedItemsListener(handleBookmarkedItemsChange, id)
        }

        return () => {
            listener && listener();
        }
    }, [handleBookmarkedItemsChange, currentUser])
    return { bookmarkedItemRefs }
}

