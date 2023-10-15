
const initialState = {
    desks: null,
    deskItems: []
}

export const desks = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_DESK_ITEMS':
            return {
                ...state,
                deskItems: action.data

            }

        case 'SET_DESKS':
            return {
                ...state,
                desks: [...state.desks.filter(item => item.id != action.data.id), action.data]

            }


        default:
            return state



    }

}

