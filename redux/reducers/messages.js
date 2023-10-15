
const initialState = {
    messages: [],

}

export const messages = (state = initialState, action) => {
    switch (action.type) {

        case 'DELETE_MESSAGE':


            return {

                ...state,
                messages: [...state.messages.filter(el => el.id !== action.id)]
            }

        case 'UPDATE_MESSAGE':
            const index = state.messages.findIndex(item => item.id == action.message.id);
            return {

                ...state,
                messages: [...state.messages.slice(0, index), action.message, ...state.messages.slice(index + 1)]
            }

        case 'FETCH_MESSAGE':
            return {

                ...state,
                messages: [...state.messages.filter(item => item.id != action.message.id), action.message]
            }




        default:
            return state
    }





}