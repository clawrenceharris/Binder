import {
    View,

    Animated,
    StyleSheet,
    TouchableWithoutFeedback,

} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ProfileButton } from '../components'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { assets, Colors } from '../constants'
import { SHADOWS, SIZES } from '../constants/Theme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import useColorScheme from '../hooks/useColorScheme'
import { auth } from '../Firebase/firebase'

import { haptics } from '../utils'

import { ActivityIndicator, Switch } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import { MediumText, RegularText } from '../components/StyledText'
import Button from '../components/Button'
import Search from './Search'
import Profile from './Profile'
import Chats from './Chats'
import Desk from './Desk'
import { useChats } from '../hooks/useChats'
import { useNotifications } from '../hooks/useNotifications'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { fetchChats, fetchUserChats } from '../redux/actions/chats'
import { fetchUser, fetchUserFriends, fetchUserSchool, fetchUserStudyBuddies } from '../redux/actions/user'
import { createDesk, updateDesk } from '../services/desk'

import { useFriends } from '../hooks/useFriends'
import { useStudyBuddies } from '../hooks/useStudyBuddies'
import CustomImage from '../components/CustomImage'


const ICON_SIZE = 28

const Main = (props) => {
    const opacity = useRef(new Animated.Value(1)).current;
    const colorScheme = useColorScheme();
    const [selectionMode, setSelectionMode] = useState(false);
    const insets = useSafeAreaInsets();
    const [showDeskModal, setShowDeskModal] = useState(false);
    useChats();
    useNotifications();
    useFriends();
    useStudyBuddies();
    const currentUser = useSelector(state => state.userState.currentUser);
    const school = useSelector(state => state.schoolState.school);
    const chats = useSelector(state => state.userChatsState.chats);
    const notifications = useSelector(state => state.notificationsState.notifications);
    const BottomTab = createBottomTabNavigator();
    const [isPublic, setIsPublic] = useState(false);
    const [unseenMessages, setUnseenMessages] = useState([]);
    useEffect(() => {
        if (isPublic != currentUser?.desk?.isPublic)
            updateDesk(auth.currentUser.uid, { isPublic })
                .catch((e) => {
                    if (e.message.includes("No document to update")) {
                        createDesk()
                    }
                    props.onTaskError(e.message)


                })



    }, [isPublic, currentUser])


    const toggleIsPublic = () => {
        setIsPublic(!isPublic);
    }
    useEffect(() => {
        const unseenMessages = chats.filter(item =>
            item.recentActivity.uid != auth.currentUser.uid &&
            !item.recentActivity?.seenBy?.includes(auth.currentUser.uid));
        setUnseenMessages(unseenMessages)

    }, [chats])

    useEffect(() => {
        props.fetchUserSchool();
        props.fetchUser();
        props.fetchChats();
    }, [currentUser?.schoolId])


    const deskHeaderRight = () => {
        if (!selectionMode) {


            return (
                <View style={{ right: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                    <CustomImage source={isPublic ? assets.unlock : assets.lock} style={{ marginRight: 5, width: 20, height: 20, tintColor: isPublic ? Colors.accent : Colors[colorScheme].darkGray }} />
                    <Switch
                        onValueChange={toggleIsPublic}
                        value={isPublic}
                        color={Colors.accent}

                    />
                </View>
            )
        }
        else {
            return (
                <TouchableWithoutFeedback
                    onPress={() => setSelectionMode(false)}
                >
                    <View style={{ right: 15 }}>

                        <MediumText tint h4>Cancel</MediumText>
                    </View>
                </TouchableWithoutFeedback>)
        }
    }
    const deskHeaderLeft = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 80 }}>
                {headerLeft()}

                <TouchableWithoutFeedback
                    onPress={() => props.navigation.navigate('Explore')}>
                    <View style={[styles.headerButton, { left: 30, backgroundColor: Colors[colorScheme].lightGray }]}>
                        <CustomImage source={assets.search_2} style={styles.headerIcon} tintColor={Colors[colorScheme].veryDarkGray} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );


    }


    const profileHeaderRight = () => {
        return (
            <TouchableWithoutFeedback
                onPress={() => props.navigation.navigate('Settings')}>
                <View style={[styles.headerButton, { right: 15, backgroundColor: Colors[colorScheme].lightGray }]}>
                    <CustomImage source={assets.settings} style={styles.headerIcon} tintColor={Colors[colorScheme].veryDarkGray} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
    const headerLeft = () => {

        return (


            <TouchableWithoutFeedback
                onPress={() => { props.navigation.navigate('Notifications') }}>
                <View style={[styles.headerButton, {
                    left: 15,
                    backgroundColor: Colors[colorScheme].lightGray,
                }]}>
                    <CustomImage source={assets.bell} style={styles.headerIcon} tintColor={Colors[colorScheme].veryDarkGray} />

                    {notifications.some(item => item.isSeen == false) &&
                        <View style={[styles.badgeContainer, { backgroundColor: Colors[colorScheme].background }]}>
                            <View style={styles.badge} />

                        </View>}

                </View>
            </TouchableWithoutFeedback>




        )
    }




    if (!currentUser) {
        return (
            <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors[colorScheme].background }}>
                <ActivityIndicator size={'large'} color={Colors.accent} />

            </View>
        )
    }




    return (
        <>
            <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
            <BottomTab.Navigator

                initialRouteName="Chats"
                screenOptions={{

                    tabBarStyle: {
                        backgroundColor: Colors[colorScheme].invertedTint,
                        height: 100,
                        position: 'absolute',
                        borderTopColor: Colors[colorScheme].gray,
                        borderTopWidth: 1,
                        zIndex: selectionMode ? -1 : 0

                    },


                    tabBarActiveTintColor: Colors.accent,
                    headerStyle: { backgroundColor: Colors[colorScheme].background, height: SIZES.header + insets.top },
                    headerTitleStyle: {
                        fontFamily: 'AvenirNext-Medium', fontSize: 24, color: Colors[colorScheme].tint
                    },
                    headerShadowVisible: false,

                    tabBarShowLabel: false,



                }}>


                <BottomTab.Screen
                    name="Desk"
                    listeners={() => ({
                        tabPress: haptics
                    })}

                    children={(props) => <Desk
                        showDeskModal={showDeskModal}
                        setShowDeskModal={setShowDeskModal}
                        selectionMode={selectionMode}
                        toggleSelectionMode={() => setSelectionMode(!selectionMode)}
                        id={auth.currentUser.uid}
                        {...props} />}
                    options={{
                        headerStyle: { backgroundColor: Colors[colorScheme].invertedTint },
                        headerRight: deskHeaderRight,
                        headerLeft: deskHeaderLeft,
                        title: 'My Desk',
                        tabBarIcon: ({ focused }) => (


                            <CustomImage
                                source={focused ? assets.desk : assets.desk_o}
                                style={styles.footerIcon}
                                tintColor={Colors[colorScheme].darkGray}
                            />
                        )


                    }}

                />



                <BottomTab.Screen
                    name="Chats"
                    component={Chats}
                    listeners={() => ({
                        tabPress: haptics

                    })}
                    options={{
                        headerLeft,

                        tabBarBadge: unseenMessages.length > 0 ? '' : null,
                        tabBarBadgeStyle: unseenMessages.length > 0 ? {
                            top: 15,
                            borderWidth: 3,
                            color: Colors.white,
                            backgroundColor: unseenMessages.length > 0 ? Colors.accent : Colors[colorScheme].invertedTint,
                            borderColor: Colors[colorScheme].invertedTint
                        } : null,

                        headerShown: true,

                        title: 'Chats',
                        tabBarIcon: ({ focused }) => (

                            <CustomImage
                                source={focused ? assets.chat_bubble : assets.chat_bubble_o}
                                style={styles.footerIcon}
                                tintColor={Colors[colorScheme].darkGray}

                            />
                        )
                    }}
                />




                <BottomTab.Screen
                    name="SearchMain"
                    children={(childrenProps) =>
                        <Search
                            {...childrenProps}
                            {...props}


                        />}

                    listeners={() => ({
                        tabPress: haptics
                    })}
                    options={{
                        headerShown: false,

                        title: 'Search',
                        tabBarIcon: ({ focused }) => (
                            <CustomImage
                                source={focused ? assets.search : assets.search_o}
                                style={styles.footerIcon}
                                tintColor={Colors[colorScheme].darkGray}

                            />
                        )


                    }}

                />


                <BottomTab.Screen
                    name="ProfileMain"
                    children={(childrenProps) => <Profile uid={auth.currentUser.uid} {...childrenProps} {...props} />}
                    listeners={() => ({
                        tabPress: haptics
                    })}
                    options={{
                        headerLeft,
                        headerRight: profileHeaderRight,
                        headerShown: true,
                        title: '',
                        tabBarIcon: ({ focused }) => (



                            <CustomImage
                                source={focused ? assets.profile : assets.profile_o}
                                style={styles.footerIcon}
                                tintColor={Colors[colorScheme].darkGray}

                            />

                        )


                    }}

                />
            </BottomTab.Navigator>
        </>
    )


}


const styles = StyleSheet.create({
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: 'center',
        padding: 5,

        justifyContent: 'center',
    },

    headerIcon: {
        width: 25,
        height: 25,

    },

    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    footerIcon: {

        width: ICON_SIZE,
        height: ICON_SIZE
    },
    badge: {
        width: 10,
        height: 10,
        borderRadius: 25,
        backgroundColor: Colors.primary
    },
    badgeContainer: {

        padding: 3,
        borderRadius: 25,
        position: 'absolute',
        right: -5,
        top: 2,
    }
})


const mapDispatchProps = (dispatch) =>
    bindActionCreators({
        fetchUser,
        fetchUserChats,
        fetchChats,
        fetchUserSchool,
    }, dispatch)


export default connect(null, mapDispatchProps)(Main)