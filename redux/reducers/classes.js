import { CLASSES, CLASSES_DESK, CLASSES_USERS } from "../constants"

const initialState = {
    classes: [],
    users: [],
    desk: null,
    chatroom: null,


}

export const classes = (state = initialState, action) => {
    switch (action.type) {
        case CLASSES:
            return {
                ...state,
                classes: [...state.classes.filter(el => el.id !== action.class.id), action.class]

            }


        case CLASSES_USERS:
            return {
                ...state,
                users: [...state.users.filter(el => el.uid !== action.user.uid), action.user]
            }


        case CLASSES_DESK:
            return {
                ...state,
                desk: action.desk
            }




        default:
            return state



    }

}