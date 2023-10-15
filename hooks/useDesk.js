import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDesks } from '../redux/actions/desk';
import { deskListener, desksListener } from '../services/desk';

export const useDesk = (id) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [desk, setDesk] = useState(null)

    const handleDeskChange = useCallback(
        (change) => {
            setDesk({ id: change.id, ...change.data() })

        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = desksListener(handleDeskChange, id)
        }

        return () => {
            listener && listener();
        }
    }, [handleDeskChange, currentUser])
    return { desk }
}

