
import { StyleSheet } from "react-native"
import { Colors } from "../../constants"
import { SHADOWS } from "../../constants/Theme"
export const styles = StyleSheet.create({
    imageContainer: {
        marginRight: 10,
        width: 80,
        height: 120,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 15,
        overflow: 'hidden'
    },
    cameraContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'black',

    },
    camera: {
        width: '100%',
        flex: 1,
        aspectRatio: 9 / 16,

    },

    mainContainer: {
        flex: 1,
        backgroundColor: 'black',
        paddingBottom: 100,
        paddingHorizontal: 5
    },

    image: {
        width: '100%',
        height: '100%'
    },

    icon: {
        width: 22,
        height: 22,
        tintColor: Colors.white,

    },
    sideBarIcon: {
        width: 25,
        height: 25,

        marginTop: 20
    },
    sendToContainer: {
        position: 'absolute',
        top: 15,
        height: 45,
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

        ...SHADOWS.dark

    },

    bottomContianer: {
        width: '100%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',


    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        width: '100%',
        padding: 20
    },

    send: {
        width: 35,
        height: 35,
        tintColor: 'white',
        marginLeft: 10
    },

    sendToText: {
        zIndex: 1,
    },
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },


    galleryButton: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 25,
        overflow: 'hidden',




    },

    galleryButtonImage: {
        width: 38,
        height: 38,
    },
    sideBarContainer: {
        top: 60,
        marginHorizontal: 20,
        right: 0,
        position: 'absolute'
    }


})