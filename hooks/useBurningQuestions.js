import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { burningQuestionsListener } from '../services/burningQuestions';

export const useBurningQuestions = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [burningQuestions, setBurningQuestions] = useState([]);

    const handleDeskItemsChange = useCallback(
        (change) => {

            setBurningQuestions(change.docs.map(item => {

                return { id: item.id, ...item.data() }
            }))
        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = burningQuestionsListener(snapshot => handleDeskItemsChange(snapshot));
        }

        return () => {
            listener && listener();
        }
    }, [handleDeskItemsChange, currentUser])
    return { burningQuestions }
}

