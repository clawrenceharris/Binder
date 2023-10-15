import { auth, db } from "../../Firebase/firebase";




export function fetchNotifications() {
    // return ((dispatch) => {

    //     db.collection('users')
    //         .doc(auth.currentUser.uid)
    //         .collection('notifications')
    //         .onSnapshot(snapshot => {
    //             const notifications = snapshot.docs.map(doc => {
    //                 const id = doc.id
    //                 const data = doc.data();
    //                 return { id, ...data };

    //             })

    //             dispatch({ type: 'FETCH_NOTIFICATIONS', payload: { notifications, loaded: true } })
    //         })
    // })
}
export const setNotifications = (data) => dispatch => dispatch({ type: 'FETCH_NOTIFICATIONS', payload: { notifications: data, loaded: true } })