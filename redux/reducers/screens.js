
const initialState = {
    stickersScreen: {
        data: {}
    },

}


export const screens = (state = initialState, action) => {
    switch (action.type) {


        case 'SET_DATA':

            return {
                ...state,
                [action.screen]:
                {
                    ...state[action.screen],
                    data: action.data,
                }

            }

        default:
            return initialState





    }

}