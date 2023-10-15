
const initialState = {
    posts: [],

}


export const feed = (state = initialState, action) => {
    switch (action.type) {


        case 'POSTS':

            return {
                ...state,
                posts: [...state.posts.filter(el => el.id != action.post.id), action.post]

            }

        default:
            return initialState





    }

}