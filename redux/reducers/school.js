import {
    SCHOOL_CLASSES,
    SCHOOL,
    SCHOOL_USERS,
    USERS,
} from "../constants"

const initialState = {
    school: null,
    users: [],
    chats: [],

}

export const school = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_SCHOOL':

            return {
                ...state,
                chats: []

            }

        case 'FETCH_SCHOOL':
            return {
                ...state,
                school: action.school
            }


        case 'FETCH_SCHOOL_CHATS':
            return {
                ...state,
                chats: action.chats
            }
        case USERS:
            return {
                ...state,
                users: action.data
            }

        default:
            return state



    }

}