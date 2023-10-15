import { db } from "../../Firebase/firebase";
import { USERS } from "../constants";

export function fetchSchoolUsers() {

    return ((dispatch, getState) => {
        const currentUser = getState().userState.currentUser;
        if (currentUser?.schoolId) {


            db.collection('users')
                .where('schoolId', '==', currentUser.schoolId)
                .onSnapshot(query => {


                    const users = query.docs.map(doc => {

                        const id = doc.id;
                        const data = doc.data();
                        return { id, ...data };



                    });
                    dispatch({ type: USERS, users })
                })

        }


    })

}






export function fetchSchoolChats() {
    return ((dispatch, getState) => {
        const currentUser = getState().userState.currentUser;
        if (currentUser?.schoolId) {
            db.collection('chatrooms')
                .where('schoolId', '==', currentUser.schoolId)
                .onSnapshot(query => {
                    const chats = query.docs.map(doc => {

                        const id = doc.id
                        const data = doc.data()
                        return { id, ...data }



                    })
                    dispatch({ type: 'FETCH_SCHOOL_CHATS', chats })



                })
        }
    })

}

