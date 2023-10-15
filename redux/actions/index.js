




export function deleteClass(id) {
    return ((dispatch) => {
        console.log("Class deleted")
        dispatch({ type: 'DELETE_CLASS', id })
    })
}

export function deleteFriend(uid) {
    return ((dispatch) => {

        dispatch({ type: 'DELETE_FRIEND', uid })
    })
}


















