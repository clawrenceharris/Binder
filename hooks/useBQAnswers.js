import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BQAnswersListener, burningQuestionsListener } from '../services/burningQuestions';
import { fetchUsersData } from '../redux/actions/user';

export const useBQAnswers = (id, users = []) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [answers, setAnswers] = useState([])

    const handleDeskItemsChange = useCallback(
        (change) => {

            setAnswers(change.docs.map(item => {

                return { id: item.id, ...item.data() }

            }))
        },
        [dispatch],
    )

    useEffect(() => {
        let listener;

        if (currentUser) {
            listener = BQAnswersListener(handleDeskItemsChange, id);
        }

        return () => {
            listener && listener();
        }
    }, [handleDeskItemsChange, currentUser])
    return { answers }
}

