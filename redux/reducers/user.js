import { SCHOOL, SCHOOL_USERS, USER_CLASSES, USER_DESK, USER_FLASHCARDS, USER_NOTES, USER, USER_STUDY_BUDDIES, USER_CHATROOMS, USER_FRIENDS, USER_SCHOOL, SCHOOL_CLASSES, SET_RANK } from "../constants"

const initialState = {
    currentUser: null,
    desk: null,
    studyBuddies: [],
    school: null,
    chatrooms: [],
    friends: [],
    rank: {},
    notifications: []
}

export const user = (state = initialState, action) => {
    switch (action.type) {





        case USER:
            return {
                ...state,
                currentUser: action.currentUser
            }


        case USER_STUDY_BUDDIES:
            return {
                ...state,
                studyBuddies: action.data
            }


        case "LOG_OUT":
            return initialState

        case USER_FRIENDS:
            return {
                ...state,
                friends: action.data
            }

        case 'CHANGE_SCHOOL':
            return {
                ...state,
                friends: !action.keepData ? [] : state.friends,
                studyBuddies: !action.keepData ? [] : state.studyBuddies
            }


        case 'DELETE_FRIEND':
            return {
                ...state,
                friends: state.friends.filter(item => item.uid !== action.uid)
            }

        case USER_DESK:
            return {
                ...state,
                desk: action.desk
            }

        case 'DELETE_DESK_ITEM':
            return {
                ...state,
                deskItems: state.deskItems.filter(item => item.id !== action.id)
            }

        case 'CLEAR_STUDY_BUDDIES':
            return {
                ...state,
                studyBuddies: []
            }
        default:
            return state



    }

}