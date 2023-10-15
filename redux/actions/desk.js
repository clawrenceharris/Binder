import { auth, db } from "../../Firebase/firebase"
import { USER_DESK } from "../constants"

export function fetchUserDesk() {
    return ((dispatch) => {

        db.collection('desks')
            .doc(auth.currentUser.uid)
            .get()
            .then(doc => {
                const id = doc.id;
                const data = doc.data();

                const desk = { id, ...data }


                dispatch({ type: USER_DESK, desk })

            })

    })
}




export const fetchDeskItem = (deskId, id) => dispatch => {
    db.collection('desks')
        .doc(deskId)
        .collection('desk items')
        .doc(id)
        .get()
        .then(doc => {
            const id = doc.id;
            const data = doc.data();
            const deskItem = { id, ...data };
            dispatch({ type: 'FETCH_DESK_ITEM', deskItem });
        })
}


export const setUserDesk = data => dispatch => dispatch({ data, type: 'SET_USER_DESK' })
export const setUserDeskItems = data => dispatch => dispatch({ data, type: 'SET_USER_DESK_ITEMS' })


export const setDesks = data => dispatch => dispatch({ data, type: 'SET_DESKS' })
export const setDeskItems = data => dispatch => dispatch({ data, type: 'SET_DESK_ITEMS' })


export const fetchUserDeskItems = () => (dispatch, getState) => {
    db.collection('desks')
        .doc(auth.currentUser.uid)
        .collection('desk items')
        .onSnapshot(query => {

            const deskItems = [];
            query.docs.forEach(doc => {
                const id = doc.id;
                const data = { id, ...doc.data() };
                const classData = null;
                const user = getState().userState.currentUser;


                const deskItem = {
                    ...data,
                    class: classData,
                    user
                }


                dispatch({ type: 'FETCH_DESK_ITEM', deskItem });

            });



        });

}



