import { auth, db } from "../../Firebase/firebase";
import { USER, USERS, USER_FRIENDS, USER_STUDY_BUDDIES } from "../constants";
import { fetchUserDesk } from "./desk";
import { fetchSchoolChats, fetchSchoolUsers } from "./school";

export const setUserFriends = data => dispatch => dispatch({ data, type: USER_FRIENDS });
export const setUserStudyBuddies = data => dispatch => dispatch({ data, type: USER_STUDY_BUDDIES });
export const setUser = data => dispatch => dispatch({ data, type: USER });



export function fetchUsersData(uid, type = USERS) {

    return ((dispatch) => {

        db.collection('users')
            .doc(uid)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data()

                    dispatch({ type, data })

                } else {
                    console.log('error in fetchUsersData function: user does not exist')
                }
            })

    })
}




export function fetchUserSchool() {
    return ((dispatch, getState) => {
        const currentUser = getState().userState.currentUser;
        if (currentUser?.schoolId) {

            db.collection('chatrooms')
                .doc(currentUser.schoolId)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        const id = doc.id;
                        const data = doc.data();
                        const school = { id, ...data };
                        dispatch({ type: 'FETCH_SCHOOL', school })
                        dispatch(fetchSchoolChats());
                        dispatch(fetchSchoolUsers());
                        dispatch(fetchUserDesk());
                    }
                    else {
                        dispatch({ type: 'FETCH_SCHOOL', school: null })
                        console.log("school does not exist");
                    }


                })
                .catch((e) => console.log("error in fetchUserSchool function:", e))
        }

    })


}



export function fetchUser() {

    return ((dispatch) => {
        db.collection('users')
            .doc(auth.currentUser.uid)
            .onSnapshot(doc => {
                if (doc.exists) {
                    const currentUser = doc.data();

                    dispatch({ type: USER, currentUser })
                } else {
                    console.log('error in fetchUser: user does not exist')
                }
            })
    })
}