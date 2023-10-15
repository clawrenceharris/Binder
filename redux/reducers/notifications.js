
const initialState = {
    notifications: [],
    loaded: false
}




export const notifications = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_NOTIFICATIONS':
            const { notifications, loaded } = action.payload;

            return {
                ...state,
                notifications,
                loaded
            }
        case "LOG_OUT":
            return initialState
        default:
            return state
    }
}