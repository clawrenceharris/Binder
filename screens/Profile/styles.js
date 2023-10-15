import {
    StyleSheet,

} from 'react-native'
import { Colors } from '../../constants'
export const styles = StyleSheet.create({

    nameContainer: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        alignItems: 'flex-start',
        marginLeft: 30


    },
    calloutContainer: {
        borderRadius: 8,

        height: 40,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    studyBuddyContainer: {
        borderRadius: 25,
        flexDirection: 'row',

        position: 'absolute',
        right: 10,
        top: 10,
        alignItems: 'cneter',
        justifyContent: 'center',
        padding: 5,
        paddingHorizontal: 15,
    },
    profileImageContainer: {
        alignItems: 'center',

    },
    profileItemCloseBtn: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        marginTop: 20
    },
    friendsCookiesContainer: {
        width: '100%',
        marginTop: 20,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 15,


    },
    profileHeaderContentContainer: {
        borderRadius: 15,
        padding: 10,

        marginTop: 60,
        alignItems: 'flex-start',
        justifyContent: 'space-between',



    },
    emojiContainer: {
        backgroundColor: '#00000020',
        borderRadius: 50,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#00000030',




    },
    headerIcon: {
        width: 28,
        height: 28,
        tintColor: Colors.white
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: 'center',
        padding: 5,
        position: 'absolute',
        backgroundColor: '#00000070',
        justifyContent: 'center',
    },

    profileItemContainer: {
        borderColor: Colors.light.gray,
        borderWidth: 1.5,
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 10,
        padding: 6,
        flexDirection: 'row',
        marginRight: 10,
        marginBottom: 10,
        justifyContent: 'center',
        backgroundColor: '#D5DFE330'
    },
    profileItemsContainer: {
        padding: 10,
        paddingVertical: 20,
        borderRadius: 15,
        marginTop: 20,
        justifyContent: 'center'

    },

    classHeader: {
        padding: 30,
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },

    sectionTitle: {
        fontFamily: 'KanitMedium',
        fontSize: 18,
        marginTop: 30

    },

    quickActionBtn: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,

    },

    className: {
        fontSize: 20,
        fontFamily: 'KanitBold'


    },
    pencilIcon: {
        width: 15,
        height: 15,

        marginLeft: 10
    },
    headerIcon: {

        width: 24,
        height: 24
    },

    number: {
        fontSize: 11,
        color: 'gray',
        marginLeft: 5
    },

    checkIcon: {
        position: 'absolute',
        top: 20,
        left: 10,
        width: 10,
        height: 10,
        tintColor: Colors.accent
    },

    addedFriendIcon: {
        width: 28,
        height: 28,
        tintColor: Colors.accent
    },
    addIcon: {
        position: 'absolute',
        top: 20,
        left: 10,
        width: 10,
        height: 10,

    },
    quickActionsContainer: {
        flexDirection: 'row',
        width: '70%',
        marginTop: 30,
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    sharedChatsContainer: {
        marginTop: 20,
        borderRadius: 15,

    },
    quickActionIcon: {
        width: 25,
        height: 25,
        tintColor: Colors.white

    },
    rankIcon: {
        width: 20,
        height: 20,
        tintColor: Colors.primary
    }
})


