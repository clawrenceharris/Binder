import { USERS } from "../constants"

const initialState = {
    users: [],


}

export const users = (state = initialState, action) => {
    switch (action.type) {

        case USERS:
            //console.log({ users: action.users })
            return {

                ...state,
                users: action.users
            }

        default:
            return state



    }

}