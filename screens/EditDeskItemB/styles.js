import { StyleSheet } from "react-native"
const styles = StyleSheet.create({
    cardContainerRight: {
        marginLeft: 10,
        width: 180,
        height: 150,
        backgroundColor: '#00000010',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'row',

    },

    cardContainerLeft: {
        width: 180,
        height: 150,
        backgroundColor: '#00000010',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'row',

    },

    imageContainer: {
        marginRight: 20,
        width: 150,
        height: 150,
        backgroundColor: 'gray',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },

    sectionNumberInput: {
        marginLeft: 20,

        fontSize: 16,
        backgroundColor: '#00000010',
        borderRadius: 15,
        paddingHorizontal: 30,
        height: 60
    },

    descriptionInput: {

        fontSize: 16,
        backgroundColor: '#00000010',
        borderRadius: 15,
        padding: 10,
        height: 100
    },

    titleInput: {
        flexDirection: 'row',
        width: '100%',

        fontSize: 28,
        color: 'white'
    },

    sectionHeaderText: {
        marginBottom: 10,
        marginTop: 40
    },

    cornerButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#00000060',
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardInput: {
        flexDirection: 'row',

        fontSize: 16,
        padding: 5
    }



})
export default styles;