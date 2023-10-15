
const initialState = {
    chats: [],

}

export const userChats = (state = initialState, action) => {
    switch (action.type) {

        case 'DELETE_CHAT':


            return {

                ...state,
                chats: [...state.chats.filter(el => el.id !== action.id)]
            }
        case 'FETCH_USER_CHATS':
            return {

                ...state,
                chats: action.chats
            }

        case 'LOG_OUT':
            return initialState

        default:
            return state
    }
}


export const chats = (state = initialState, action) => {
    switch (action.type) {


        case 'FETCH_CHAT':
            return {

                ...state,
                chats: [...state.chats.filter(item => item.id != action.chat.id), action.chat]
            }

        case 'FETCH_CHATS':
            return {
                ...state,
                chats: action.chats
            }




        default:
            return state
    }





}