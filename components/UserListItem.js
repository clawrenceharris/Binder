import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ProfileButton from './ProfileButton'
import SelectionButton from './SelectionButton'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { LightText, RegularText } from './StyledText'
import { auth } from '../Firebase/firebase'
import { SHADOWS } from '../constants/Theme'
import { useNavigation } from '@react-navigation/native'
import { getChatByUid } from '../services/chats'
import { useSelector } from 'react-redux'
import Button from './Button'
import CustomImage from './CustomImage'
import { StudyBuddyBadge } from './ProfileBadges'
import { addFriend } from '../services/friends'
import { addNotification } from '../services/notifications'

const UserListItem = ({
    onProfileButtonPress,
    isSelected,
    onPress,
    rightComponent,
    uid,
    onSelect,
    subtitle,
    disabled,
    useCase,
    style,
    isSelectable,
    onTaskStart,
    onTaskComplete,
    onTaskError,
    ...props }) => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const user = props.user;
    const currentUser = useSelector(state => state.userState.currentUser);
    const [loadingFriend, setLoadingFriend] = useState(false);
    const friends = useSelector(state => state.userState.friends).map(item => item?.uid);
    const studyBuddies = useSelector(state => state.userState.studyBuddies).map(item => item?.uid);
    const isFriend = () => {
        return friends.includes(user.uid);
    }
    const isStudyBuddy = () => {
        return studyBuddies.includes(user.uid);
    }
    const styles = StyleSheet.create({
        mainContainer: {
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors[colorScheme].background,

        },


        nameContainer: {
            marginLeft: 10
        },
        leftContainer: {
            alignItems: 'center',
            flexDirection: 'row'
        },
        friendLeftContainer: {
            flexDirection: 'row',
        },
        friendBuddyMainContainer: {
            marginRight: 15,
            borderRadius: 15,
            backgroundColor: Colors[colorScheme].invertedTint,
            ...SHADOWS[colorScheme],
            marginBottom: 20,



        },
        friendNameContainer: {
            marginLeft: 10,
        },

        studyBuddyTopContainer: {
            flexDirection: 'column'
        },


        studyBuddyNameContainer: {
            marginVertical: 10,
            marginLeft: 0
        },
        studyBuddyMainContainer: {
            borderRadius: 15,
            backgroundColor: Colors[colorScheme].invertedTint,
            ...SHADOWS[colorScheme],
            marginRight: 15,
            marginBottom: 20,
            flexDirection: 'column',
            paddingHorizontal: 25

        },

        backContainer: {
            backgroundColor: Colors[colorScheme].darkGray
        }

    })

    const onAddPress = () => {

        setLoadingFriend(true);
        addFriend(user.uid)
            .then(() => {
                setLoadingFriend(false);

                addNotification(
                    user.uid,
                    currentUser.uid,
                    currentUser.displayName,
                    'added you as a friend',
                    'added friend',
                    {
                        name: 'Profile',
                        params: { uid: user.uid }
                    }
                );
            })
            .catch((e) => {
                onTaskError(e.message);


            });
    }

    const onChatPress = () => {

        getChatByUid(user.uid)
            .then((chat) => {
                if (chat) {
                    navigation.navigate('Chat', {
                        ...chat,
                        user,
                        name: user.displayName,
                        photoURL: user.photoURL
                    })


                }
                else {

                    navigation.navigate('Chat', {
                        users: [auth.currentUser.uid, user.uid],
                        name: user.displayName,
                        photoURL: user.photoURL,
                        type: 'private'
                    })

                }
            })
    }
    if (user) {
        return (
            <View style={useCase != 'study buddy' && styles.backContainer}>


                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.mainContainer,
                    useCase == 'study buddy' && styles.studyBuddyMainContainer,

                    {
                        ...style
                    }]}
                    disabled={disabled}
                    onPress={() => onPress ? onPress() : navigation.navigate('Profile', { uid: user.uid })}

                >

                    <View style={[
                        styles.leftContainer,
                        useCase == 'study buddy' && styles.studyBuddyTopContainer
                    ]}>
                        <ProfileButton
                            size={50}
                            imageURL={user?.photoURL}
                            defaultImage={assets.person_gradient.uri}
                            onPress={() => onProfileButtonPress ? onProfileButtonPress() : navigation.navigate('Profile', { uid: user.uid })}
                            disabled={disabled}
                            badge={
                                isStudyBuddy() &&
                                (useCase == 'study buddy' || useCase == 'chat' || useCase == 'chat profile') &&
                                <StudyBuddyBadge />
                            }
                        />
                        <View style={[
                            styles.nameContainer,
                            useCase == 'study buddy' && styles.studyBuddyNameContainer,
                            useCase == 'friend' && styles.friendNameContainer]}>
                            <RegularText h5>{user.displayName}</RegularText>
                            {user.uid == auth.currentUser.uid && <LightText h5 darkgray >{"Me"}</LightText>}
                            {subtitle && < LightText h5 darkgray>{subtitle}</LightText>}
                        </View>

                    </View>


                    {isSelectable &&
                        <SelectionButton
                            onSelect={onSelect}
                            isSelected={isSelected}
                        />
                    }


                    {rightComponent ||

                        user.uid != auth.currentUser.uid && !isSelectable ?
                        !isFriend() ?

                            <Button
                                animationEnabled={false}
                                onPress={onAddPress}
                                title="Add"
                                loading={loadingFriend}
                                titleStyle={{ fontSize: 16, color: Colors[colorScheme].darkGray }}
                                colors={[Colors[colorScheme].lightGray, Colors[colorScheme].lightGray]}
                                style={{ maxHeight: 40, paddingHorizontal: 10 }}
                                icon={<CustomImage source={assets.add_friend} style={{ width: 22, height: 22, tintColor: Colors[colorScheme].darkGray, marginRight: 5 }} />}

                            />

                            :
                            <Button
                                animationEnabled={false}
                                onPress={onChatPress}
                                title="Chat"
                                titleStyle={{ fontSize: 16, color: Colors[colorScheme].darkGray }}
                                colors={[Colors[colorScheme].lightGray, Colors[colorScheme].lightGray]}
                                style={{ maxHeight: 40, paddingHorizontal: 10 }}
                                icon={<CustomImage source={assets.chat_bubble} style={{ width: 22, height: 22, tintColor: Colors[colorScheme].darkGray, marginRight: 5 }} />}
                            />
                        :
                        <></>

                    }

                    {useCase === 'add study buddy' && !isSelected &&
                        <TouchableOpacity
                            onPress={onSelect}
                            style={{ backgroundColor: Colors.yellow, borderRadius: 25, padding: 4, paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: 'Kanit', color: Colors.light.tint }}>{"🤓 Add"}</Text>

                        </TouchableOpacity>
                    }

                    {useCase === 'add study buddy' && isSelected &&
                        <View style={{ backgroundColor: Colors[colorScheme].gray, borderRadius: 25, padding: 4, paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: 'Kanit', color: Colors.yellow }}>{"🤓 Added!"}</Text>

                        </View>
                    }



                </TouchableOpacity >
            </View >
        )
    }
}






export default UserListItem