import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Animated,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Header from '../components/Header'
import { auth, db } from '../Firebase/firebase'
import { connect, useSelector } from 'react-redux'
import { ProfileButton } from '../components'
import { SHADOWS } from '../constants/Theme'
import { capitalize, getDefaultImage, getProfileItemsSubtitle, haptics } from '../utils'
import { LightText, MediumText, RegularText } from '../components/StyledText'
import { ActivityIndicator } from 'react-native-paper'
import Button from '../components/Button'
import ProfileItemsButton from '../components/ProfileItemsButton'
import { addSystemMessage, fetchChat, fetchMessages, fetchPinnedMessages, updateChat } from '../services/chats'
import AnimatedHeader from '../components/AnimatedHeader'
import ProfileActionButton from '../components/ProfileActionButton'
import { fetchUser } from '../services/user'
import SlideModal from '../components/SlideModal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OptionsList from '../components/OptionsList'
import { bindActionCreators } from 'redux'
import CustomImage from '../components/CustomImage'
import { useUser } from '../hooks/useUser'
import { useMessages } from '../hooks/useMessages'
import moment from 'moment'




const ChatProfile = (props) => {
    const colorScheme = useColorScheme();
    const { id, type, colors, photoURL, name, isPublic, icon, emoji, createdAt, user } = props.route.params;
    const [users, setUsers] = useState(props.route.params.users);
    const [photos, setPhotos] = useState([]);
    const [chat, setChat] = useState({
        id,
        users,
        colors,
        type,
        photoURL,
        name,
        emoji,
        icon,
        isPublic,
        createdAt,
        user


    })
    const { height } = Dimensions.get('window');
    const [videos, setVideos] = useState([]);
    const currentUser = useSelector(state => state.userState.currentUser);
    const [popular, setPopular] = useState([]);
    const [pinned, setPinned] = useState([]);
    const [deskItems, setDeskItems] = useState([]);
    const [burningQuestions, setBurningQuestions] = useState([]);
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const chats = useSelector(state => state.userChatsState.chats)
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const uid = users.find(user => user != auth.currentUser.uid)
    const { messages } = useMessages(id);

    const profileButtonScale = scrollY.interpolate({
        inputRange: [50, 100],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });
    const profileNameOpacity = scrollY.interpolate({
        inputRange: [50, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {

        setDeskItems(messages.filter(message => message.contentType == 'desk item').map(item => item.specialChatItem.id));
        setPhotos(messages.filter(message => message.contentType == 'photo').map(item => item.media));
        setPopular(messages.filter(message => message?.likes?.length > 0).sort((a, b) => a?.likes?.length > b?.likes?.length ? 1 : -1));
        setPinned(messages.filter(message => message?.pinned));
        setBurningQuestions(messages.filter(message => message.contentType == 'burning question').map(item => item.specialChatItem.id))



    }, [chats, messages])
    const HeadeRight = () => {
        return (


            <TouchableWithoutFeedback onPress={() => setShowMoreOptions(true)}>

                <CustomImage source={assets.more} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].tint }} />
            </TouchableWithoutFeedback>


        )
    }

    const onManageFriendshipPress = () => {
        setShowMoreOptions(false);

    }
    const onBlockPress = () => {
        setShowMoreOptions(false);

    }


    const onLeavePress = () => {
        setShowMoreOptions(false);

    }

    const onEditPress = () => {
        console.log(chat.isPublic)
        setShowMoreOptions(false);
        props.navigation.navigate('EditChat', {
            useCase: 'edit group',
            ...chat,

            onSubmit: (chat) => { updateChat(id, chat); setChat(chat); props.route.params?.setChat && props.route.params.setChat(chat) }
        })
    }
    const onCameraPress = () => {
        props.navigation.navigate('Camera', {

            onSendStart: props.onSendStart,
            onSendComplete: props.onSendComplete,
            onSendError: props.onSendError,
            chat,
            useCase: 'chat'
        })
    }
    const addUsers = (selected) => {
        const updatedUsers = [...users, ...selected];
        setUsers(updatedUsers);
        updateChat(id, { users: updatedUsers });
    }


    const removeUser = (item) => {
        const updatedUsers = users.filter(uid => item.uid != uid)
        setUsers(updatedUsers);
        updateChat(id, { users: updatedUsers })
            .then(() => {
                addSystemMessage(id, auth.currentUser.uid + " removed " + item.displayName + ' from the chat')
            })
    }

    const onAddMembersPress = () => {
        props.navigation.navigate('SelectUsers', {

            title: "Add Members",
            submitButtonTitle: "Add",
            onSubmit: addUsers

        })
    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <AnimatedHeader
                animatedValue={scrollY}
                navigation={props.navigation}
                titleInputRange={[150, 200]}
                inputRange={[0, 200]}
                animatedTitle={type == 'private' ? user?.displayName : name}
                headerRight={<HeadeRight />}


            />
            <SlideModal
                height={height - (3 * 50) - 10}
                showModal={showMoreOptions}
                onCancel={() => setShowMoreOptions(false)}>
                <OptionsList

                    options={type === 'private' ? ['Manage Friendship', 'Block'] : ['Edit ' + capitalize(chat.type), 'Leave ' + capitalize(chat.type)]}
                    onOptionPress={type === 'private' ? [onManageFriendshipPress, onBlockPress] : [onEditPress, onLeavePress]}
                    onCancel={() => setShowMoreOptions(false)}

                />
            </SlideModal>

            <ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
                style={{ padding: 20 }}>
                <View style={{ alignItems: 'center' }}>

                    <Animated.View style={{ transform: [{ scale: profileButtonScale }] }}>

                        <ProfileButton
                            style={{ zIndex: 100, }}
                            imageURL={chat.type == 'private' ? user?.photoURL : chat.photoURL}
                            size={110}

                            emoji={chat.emoji}
                            onPress={() => chat.type == 'private' && props.navigation.navigate('Profile', { uid })}
                            defaultImage={chat.icon || getDefaultImage(chat.type)}
                            colors={chat.colors}

                        />
                    </Animated.View>

                    <Animated.View style={{ opacity: profileNameOpacity, alignItems: 'center' }}>

                        <MediumText tint h4 style={{ marginTop: 20 }}>{type == 'private' ? user?.displayName : chat.name}</MediumText>
                        {type != 'private' &&
                            <RegularText h4 style={{ color: Colors.light.darkGray }}>{chat.type}</RegularText>}
                    </Animated.View>

                </View>



                <View style={{ alignSelf: 'center', flexDirection: 'row', width: '80%', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 20 }}>

                    {type == 'private' ?
                        <ProfileActionButton
                            title="Profile"
                            source={assets.profile}
                            onPress={() => props.navigation.push('Profile', { uid })}

                        />
                        :
                        <ProfileActionButton
                            title="Add"
                            source={assets.add_friend}
                            onPress={onAddMembersPress}

                        />
                    }

                    <ProfileActionButton
                        title={"Camera"}

                        source={assets.camera}
                        onPress={onCameraPress}

                    />

                    <ProfileActionButton
                        title="Search"
                        source={assets.search}
                        onPress={() => props.navigation.navigate('Items', {
                            useCase: 'messages',
                            title: 'Messages',
                            items: messages.filter(item => item.contentType == 'text')
                        })}

                    />



                </View>


                <View style={{ marginBottom: 20, borderRadius: 15, ...SHADOWS[colorScheme], backgroundColor: Colors[colorScheme].invertedTint }}>

                    {type != 'private' &&
                        <ProfileItemsButton

                            onPress={() => props.navigation.navigate('Items', {
                                items: users,
                                title: 'Members',
                                useCase: 'members',
                                canNavigate: props.navigation.getState().index <= 2,
                                onRemovePress: removeUser
                            })}

                            source={assets.group}
                            title={"Members"}
                            subtitle={getProfileItemsSubtitle(users, "Member")}
                            isBottom
                            isTop
                        />}
                </View>

                <MediumText h4 verydarkgray style={{ marginTop: 20 }}>
                    {"Sent In Chat"}
                </MediumText>

                <View style={{ marginBottom: 20, borderRadius: 15, ...SHADOWS[colorScheme], backgroundColor: Colors[colorScheme].invertedTint }}>

                    <ProfileItemsButton
                        items={deskItems}
                        isTop
                        source={assets.desk}
                        title={"Desk Items"}
                        subtitle={getProfileItemsSubtitle(deskItems, "Desk Item")}

                    />
                    <ProfileItemsButton
                        items={photos.concat(videos)}
                        source={assets.image}
                        title={"Media"}
                        subtitle={getProfileItemsSubtitle(photos, "Photo")}

                    />

                    <ProfileItemsButton
                        items={burningQuestions}
                        source={assets.burning_question}
                        title={"Burning Questions"}
                        subtitle={getProfileItemsSubtitle(burningQuestions, "Burning Question")}
                        colors={[Colors.yellow, Colors.red]}
                        isBottom
                    />



                </View>
                <MediumText h4 verydarkgray style={{ marginTop: 20 }}>
                    {"Highlights"}
                </MediumText>

                <View style={{ marginBottom: 20, ...SHADOWS[colorScheme], backgroundColor: Colors[colorScheme].invertedTint, borderRadius: 15 }}>
                    <ProfileItemsButton
                        items={popular}
                        onPress={() => props.navigation.navigate('Items', { items: popular, title: 'Popular Messages', useCase: 'messages' })}
                        source={assets.heart}
                        title={"Popular Messages"}
                        subtitle={getProfileItemsSubtitle(popular, "Popular Message")}
                        colors={['#F69A9D', '#E70000']}
                        isTop

                    />

                    <ProfileItemsButton
                        items={pinned}
                        source={assets.tack}
                        title={"Pinned Messages"}
                        subtitle={getProfileItemsSubtitle(pinned, "Pinned Message")}
                        colors={['#F69A9D', '#E70000']}
                        isBottom
                    />

                </View>

                {createdAt && <RegularText verydarkgray style={{ marginVertical: 20, textAlign: 'center' }}>{"Created on "}{moment(createdAt).format('MMM DD, YYYY')} </RegularText>}
                <View style={{ height: 36 }} />

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    itemsContainer: {
        justifyContent: 'space-between',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },

    quickActionIcon: {
        width: 25,
        height: 25,
        tintColor: Colors.light.veryDarkGray
    },

    addToStoryButton: {
        marginTop: 30
    },

})

const mapStateToProps = store => ({
    chats: store.chatsState.chats

});


export default connect(mapStateToProps)(ChatProfile)