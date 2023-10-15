

const initialState = {
    desk: null,
    deskItems: []
}

export const userDesk = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_USER_DESK_ITEMS':
            return {
                ...state,
                deskItems: action.data

            }

        case 'SET_USER_DESK':
            return {
                ...state,
                desk: action.data

            }


        default:
            return state



    }

}