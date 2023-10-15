import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sharedDeskItemsListener } from '../services/desk';

export const useSharedDeskItems = (id) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [sharedDeskItemRefs, setSharedDeskItemRefs] = useState([])

    const handleDeskItemsChange = useCallback(
        (change) => {
            setSharedDeskItemRefs(change.docs.map(item => (item.data().deskItemRef)))

        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = sharedDeskItemsListener(handleDeskItemsChange, id)
        }

        return () => {
            listener && listener();
        }
    }, [handleDeskItemsChange, currentUser])
    return { sharedDeskItemRefs }
}

