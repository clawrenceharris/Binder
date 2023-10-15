import { CLASS, CLASSES, CLASSES_DESK, CLASSES_USERS, CLASS_DESK, CLASS_USERS } from "../constants"

const initialState = {
    currentClass: [],
    users: [],
    desk: null,

}

export const classState = (state = initialState, action) => {
    switch (action.type) {
        case CLASS:
            return {
                ...state,
                class: action.class
            }


        case CLASS_USERS:
            return {
                ...state,
                users: state.users.find(el => el.id === action.id).users
            }


        case CLASS_DESK:
            return {
                ...state,
                desk: action.desk
            }


        default:
            return state



    }

}