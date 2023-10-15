

const initialState = {
    ranks: []
}

export const ranks = (state = initialState, action) => {
    switch (action.type) {

        case 'RANKS':
            return {
                ...state,
                ranks: [...state.ranks, action.rank]
            }


        default:
            return state



    }

}