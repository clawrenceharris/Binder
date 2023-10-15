import { View, Text, StyleSheet, Animated, PanResponder, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { BoldText, LightText, MediumText, RegularText } from './StyledText'
import { SHADOWS } from '../constants/Theme'
import ProfileButton from './ProfileButton'
import { acceptDeskRequest, deleteDeskRequest } from '../services/desk'
import { addNotification, deleteNotification, updateNotification } from '../services/notifications'
import { acceptFriendRequest, addFriend, deleteFriendRequest } from '../services/friends'
import { auth } from '../Firebase/firebase'
import { ActivityIndicator } from 'react-native-paper'
import { useUser } from '../hooks/useUser'
import { Swipeable } from 'react-native-gesture-handler'
import ScaleButton from './ScaleButton'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { getDateString } from '../utils'
import CustomImage from './CustomImage'

const NotificationListItem = ({ item, ...props }) => {
    const colorScheme = useColorScheme();
    const [loading, setLoading] = useState(false);
    const { data: sender } = useUser(item.senderId);
    const currentUser = useSelector(state => state.userState.currentUser);
    const { width } = Dimensions.get('window');
    const navigation = useNavigation();
    const friends = useSelector(state => state.userState.friends).map(item => item?.uid);


    useEffect(() => {
        updateNotification(item.id, { isSeen: true });



    }, [])


    const handleAccept = () => {
        setLoading(true);

        if (item.type == 'desk request') {
            acceptDeskRequest(item.senderId, item.recipientId)
                .then(() => {
                    deleteNotification(item.id);
                    addNotification(item.senderId, item.recipientId, currentUser.displayName, 'accepted your Desk request.', 'desk request accepted');

                    setLoading(false)
                })
                .catch((e) => {
                    setLoading(false);
                    props.onTaskError(e.message);

                });
        }
        else if (item.type == 'added friend') {

            addFriend(item.senderId)
                .then(() => {

                    addNotification(
                        item.senderId,
                        auth.currentUser.uid,
                        currentUser.displayName,
                        'added you back',
                        'added friend back',
                        {
                            name: 'Profile',
                            params: { uid: auth.currentUser.uid }
                        });

                    setLoading(false);
                })
                .catch((e) => {
                    setLoading(false);
                    props.onTaskError(e.message);
                });

        }
    }

    const handleDelete = () => {
        setLoading(true);

        deleteNotification(item.id)
            .then(() => {
                if (item.type == 'desk request')
                    deleteDeskRequest(item.senderId, item.recipientId)
                setLoading(false);
            })
            .catch((e) => {
                props.onTaskError(e.message);
                setLoading(false);
            })



    }
    const onNotificationPress = () => {
        navigation.navigate(item?.navigation?.name, { ...item?.navigation?.params })

    }

    const renderRightActions = (
        progress,
        dragAnimatedValue,
    ) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-width / 2, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
        });

        const scale = dragAnimatedValue.interpolate({
            inputRange: [-width / 2, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp'
        })


        return (
            <View style={styles.swipedRow}>
                <View style={styles.swipedConfirmationContainer} />
                <Animated.View style={[styles.deleteButton, { backgroundColor: Colors[colorScheme].background, transform: [{ scale }], opacity }]}>

                    <TouchableOpacity onPress={handleDelete}>
                        {loading ?
                            <ActivityIndicator color={Colors[colorScheme].darkGray} size="small" />
                            :
                            <CustomImage source={assets.trash} style={{ width: 20, height: 20, tintColor: Colors.red }} />}
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };



    return (


        <TouchableWithoutFeedback onPress={onNotificationPress}>


            <View style={{ ...SHADOWS[colorScheme] }}>

                <Swipeable
                    onSwipeableOpen={handleDelete}
                    renderRightActions={renderRightActions} >
                    <View style={[styles.row, { backgroundColor: Colors[colorScheme].invertedTint }]}>


                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <ProfileButton
                                    onPress={onNotificationPress}
                                    disabled={item.type == 'system'}
                                    imageURL={sender?.photoURL}
                                    size={40}

                                />
                                {item.type.includes('desk') &&

                                    <View style={{ padding: 5, borderRadius: 25, position: 'absolute', top: -15, right: -15, backgroundColor: Colors[colorScheme].lightGray, borderWidth: 3, borderColor: Colors[colorScheme].invertedTint }}>
                                        <CustomImage source={assets.desk} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].darkGray }} />
                                    </View>}

                                {item.type.includes('friend') &&

                                    <View style={{ padding: 5, borderRadius: 25, position: 'absolute', top: -15, right: -15, backgroundColor: Colors[colorScheme].lightGray, borderWidth: 3, borderColor: Colors[colorScheme].invertedTint }}>
                                        <CustomImage source={assets.add_friend} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].darkGray }} />
                                    </View>}

                                {item.type.includes('burning question') &&

                                    <View style={{ padding: 5, borderRadius: 25, position: 'absolute', top: -15, right: -15, backgroundColor: Colors[colorScheme].lightGray, borderWidth: 3, borderColor: Colors[colorScheme].invertedTint }}>
                                        <CustomImage source={assets.fire} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].darkGray }} />
                                    </View>}
                            </View>

                            <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', width: '65%' }}>
                                <RegularText numberOfLines={3} style={{ fontSize: 14 }}>
                                    <MediumText>
                                        {item.title}{" "}
                                    </MediumText>


                                    <RegularText>
                                        {item.message}{"."}
                                    </RegularText>

                                    <LightText darkgray>
                                        {" "}{getDateString(new Date(item.createdAt))}
                                    </LightText>
                                </RegularText>
                            </View>


                        </View>
                        {(item.type == 'desk request' || item.type == 'added friend') &&




                            <ScaleButton
                                style={{ right: 10 }}
                                disabled={friends.includes(item.senderId)}
                                onPress={handleAccept}>

                                <View style={{ backgroundColor: friends.includes(item.senderId) ? Colors[colorScheme].lightGray : Colors.accent, borderRadius: 25, height: 35, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    {!loading ?
                                        <MediumText darkgray={friends.includes(item.senderId)} white={!friends.includes(item.senderId)}>{friends.includes(item.senderId) ? "Added" : "Add"}</MediumText>
                                        :
                                        <ActivityIndicator size={'small'} color={Colors.white} />
                                    }
                                </View>
                            </ScaleButton>




                        }
                    </View>
                </Swipeable>

            </View>

        </TouchableWithoutFeedback>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 300,
    },
    row: {
        margin: 10,
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
        paddingHorizontal: 10,

        minHeight: 70,

    },
    swipedRow: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingLeft: 5,
        width: '100%',
        backgroundColor: 'transparent',
        margin: 20,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    swipedConfirmationContainer: {
        flex: 1,
    },
    deleteConfirmationText: {
        color: '#fcfcfc',
        fontWeight: 'bold',
    },
    deleteButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center'


    },
    deleteButtonText: {
        color: '#fcfcfc',
        fontWeight: 'bold',
        padding: 3,
    },
});
export default NotificationListItem