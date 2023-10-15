import { View, FlatList, StyleSheet, Dimensions, Text, RefreshControl, Animated, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { assets, Colors } from '../constants/index';
import { SHADOWS, SIZES } from '../constants/Theme';
import { auth, db, updateCollection } from '../Firebase/firebase';
import { ChatListItem, ProfileButton } from '../components';
import Header from '../components/Header';
import firebase from 'firebase/compat/app';
import useColorScheme from '../hooks/useColorScheme';
import { getDefaultImage, getDisplayNameOrYou, getResultsFromSearch, haptics } from '../utils';
import Button from '../components/Button';
import { mainContainerStyle } from '../GlobalStyles';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import SlideModal from '../components/SlideModal';
import OptionsList from '../components/OptionsList';
import { ConfirmationModal } from '../components/Modals';
import { BoldText, MediumText, RegularText } from '../components/StyledText';
import CustomImage from '../components/CustomImage';
import { getChatByUid, getChatByUids, leaveChat, updateChat } from '../services/chats';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileActionButton from '../components/ProfileActionButton';
import { fetchMessages } from '../redux/actions/messages';
import { useChats } from '../hooks/useChats';
import { useUser } from '../hooks/useUser';
import { fetchUserChats } from '../redux/actions/chats';
import StudyBuddies from './StudyBuddies';
import SearchFilters from '../components/SearchFilters';
import { ActivityIndicator } from 'react-native';
import StyledTextInput from '../components/StyledTextInput';
import ScaleButton from '../components/ScaleButton';
const Chats = (props) => {

    const [showChatModal, setShowChatModal] = useState(false);
    const colorScheme = useColorScheme();
    const { height } = Dimensions.get('window')

    //used to show and hide confirmation modal for when the user wants to leave a chat
    const [showLeaveConfirmationModal, setShowLeaveConfirmationModal] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollY, setScrollY] = useState(new Animated.Value(0))
    const dispatch = useDispatch();
    const studyBuddies = useSelector(state => state.userState.studyBuddies).map(item => item?.uid);
    const friends = useSelector(state => state.userState.friends).map(item => item?.uid);
    const users = useSelector(state => state.usersState.users).map(item => item?.uid);
    const currentUser = useSelector(state => state.userState.currentUser);
    const school = useSelector(state => state.schoolState.school);
    const [search, setSearch] = useState('');
    const chats = useSelector(state => state.userChatsState.chats);
    const sortedChats = chats.sort((a, b) => a.recentActivity?.createdAt > b.recentActivity.createdAt ? -1 : 1)
    const [chatsResults, setChatsResults] = useState(chats);



    useEffect(() => {
        if (!chats) {
            return;
        }
        if (selectedFilter == 'Schools') {
            setChatsResults(sortedChats.filter(chat => chat.type == 'school'));
        }
        else if (selectedFilter == 'Classes') {

            setChatsResults(sortedChats.filter(chat => chat.type == 'class'));
        }
        else if (selectedFilter == 'All Students') {

            setChatsResults(sortedChats.filter(chat => {
                const otherUser = chat.users.find(uid => uid != auth.currentUser.uid);
                return chat.type == 'private' && users.includes(otherUser);
            }));
        }
        else if (selectedFilter == 'Groups & Clubs') {
            setChatsResults(sortedChats.filter(chat => chat.type == 'group' || chat.type == 'club'));
        }
        else if (selectedFilter == 'Study Buddies') {

            setChatsResults(sortedChats.filter(chat => {
                const otherUser = chat.users.find(uid => uid != auth.currentUser.uid);
                return chat.type == 'private' && studyBuddies.includes(otherUser);
            }));
        }

        else if (selectedFilter == 'Friends') {

            setChatsResults(sortedChats.filter(chat => {
                const otherUser = chat.users.find(uid => uid != auth.currentUser.uid);
                return chat.type == 'private' && friends.includes(otherUser);
            }));
        }
        else {
            setChatsResults(sortedChats);
        }


    }, [selectedFilter, chats])



    const onNewChatPress = () => {
        props.navigation.navigate('SelectUsers', {
            onSubmit: handleNewChat,
            title: "New Chat",
            renderSubmitButtonTitle: (selected) => selected.length <= 1 ? 'Chat' : 'Group Chat'
        });


    }


    const handleNewChat = (selected) => {

        if (selected.length > 1) {
            const users = selected.map(user => user.uid).concat(currentUser.uid)
            getChatByUids(users.map(user => user.uid))
                .then((chat) => {
                    if (chat) {

                        props.navigation.navigate('Chat', { ...chat })

                    }
                    else {

                        props.navigation.navigate('EditGroup', {
                            title: 'New Group Chat',
                            users,
                            useCase: 'new group'
                        })

                    }
                })
        }
        else if (selected.length == 1) {
            const user = selected[0];
            getChatByUid(user.uid)
                .then((chat) => {


                    if (chat) {
                        props.navigation.navigate('Chat', { ...chat, user })
                    }

                    else {
                        props.navigation.navigate('Chat', {
                            users: [auth.currentUser.uid, user.uid],
                            type: 'private',
                            user
                        })
                    }
                })
        }
    }



    const onLeavePress = () => {
        setShowChatModal(false);
        setTimeout(() => {
            setShowLeaveConfirmationModal(true);

        }, 500);


    }
    const handleLeaveChat = () => {
        setShowChatModal(false);

        leaveChat(selectedChat.id)
            .catch(e => props.onTaskError(e.message));
        dispatch({ type: 'DELETE_CHAT', id: selectedChat.id });


    }


    const onChatItemLongPress = (item) => {
        haptics('light');
        setShowChatModal(true);
        setSelectedChat(item);

    }



    const updateUsers = (users) => {
        if (selectedChat?.id) {
            users.forEach(user => {
                updateChat(selectedChat.id, { users: firebase.firestore.FieldValue.arrayUnion(user) });

            })
        }




    }
    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    }
    const goToChatProfile = (item) => {

        setSelectedChat(item);
        setShowChatModal(false)
        props.navigation.navigate('ChatProfile', {

            ...item,
            updateUsers
        })

    }
    const handleSearch = value => {
        setSearch(value);
        setChatsResults(getResultsFromSearch(sortedChats, value));
    }
    const onReportPress = () => {
        props.navigation.navigate('SendReport', {
            title: 'Report',
            useCase: 'report',
            data: {
                id: selectedChat?.id,
                type: 'chat'
            }
        })
    }
    const onDeletePress = () => {
        setShowChatModal(false);
        dispatch({ type: 'DELETE_CHAT', id: selectedChat?.id })
    }
    if (!chats) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={Colors[colorScheme].darkGray} size={"large"} />
            </View>
        )
    }
    return (

        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} >

            <SlideModal
                height={height - (5 * 50) - 10}
                showModal={showChatModal}
                onCancel={() => setShowChatModal(false)}>
                <OptionsList
                    showsIcons={false}
                    ListHeaderComponent={
                        <TouchableWithoutFeedback onPress={() => goToChatProfile(selectedChat)}>


                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                    <ProfileButton
                                        imageURL={selectedChat?.type == 'private' ?
                                            selectedChat.user?.photoURL :
                                            selectedChat?.photoURL}
                                        defaultImage={selectedChat?.icon || getDefaultImage(selectedChat?.type)}
                                        emoji={selectedChat?.emoji}
                                        onPress={() => goToChatProfile(selectedChat)}
                                        colors={selectedChat?.colors}

                                    />
                                    <RegularText h4 style={{ marginLeft: 10 }}>{selectedChat?.type == 'private' ?
                                        selectedChat.user?.displayName || "Someone" :
                                        selectedChat?.name
                                    }</RegularText>
                                </View>

                                <CustomImage source={assets.right_arrow} style={{ width: 28, height: 28, tintColor: Colors[colorScheme].darkGray }} />

                            </View>


                        </TouchableWithoutFeedback>
                    }
                    options={selectedChat?.type !== 'private' ? ['Leave Group', 'Delete'] : ['Report', 'Delete']}
                    onOptionPress={selectedChat?.type !== 'private' ? [onLeavePress, onDeletePress] : [onReportPress, onDeletePress]}
                    onCancel={() => setShowChatModal(false)}

                />
            </SlideModal>



            <SlideModal toValue={0.5} showModal={showLeaveConfirmationModal} onCancel={() => setShowLeaveConfirmationModal(false)}>


                <ConfirmationModal
                    confirmText={"Leave"}
                    message={"Leave " + selectedChat?.name + "?"}
                    onConfirmPress={() => { handleLeaveChat(); setShowLeaveConfirmationModal(false) }}
                    onCancelPress={() => setShowLeaveConfirmationModal(false)}
                />


            </SlideModal>


            <View style={{ paddingHorizontal: 15, marginTop: 15 }}>

                <StyledTextInput
                    placeholder={"Search chats"}
                    icon={<CustomImage
                        source={assets.search}
                        style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }}
                    />
                    }
                    onChangeText={handleSearch}
                    value={search}

                />
            </View>
            <SearchFilters
                style={{ marginVertical: 15 }}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}

            />


            <FlatList
                style={{ height: '100%' }}
                ListEmptyComponent={
                    chats.length == 0 ?
                        <MediumText darkgray h5 style={{ marginTop: 40, textAlign: 'center' }}>{"You don't have any chats yet"}</MediumText>
                        :
                        <MediumText darkgray h5 style={{ marginTop: 40, textAlign: 'center' }}>{"No results"}</MediumText>
                }

                refreshControl={

                    <RefreshControl
                        tintColor={Colors[colorScheme].darkGray}
                        refreshing={refreshing}
                        title=''
                        onRefresh={onRefresh}
                    />

                }
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
                scrollEnabled
                ListHeaderComponent=
                {
                    school &&
                    <ChatListItem

                        imageURL={assets.new_chat.uri}
                        onPress={() => props.navigation.navigate('Discover')}
                        title={"Discover & Create Chats"}
                        subtitle={"Join communities made by " + school?.name + ' students'}
                        icon={<CustomImage source={assets.add} style={{ width: 25, height: 25, tintColor: Colors.white }} />}
                    />

                }

                data={chatsResults}
                renderItem={({ item }) =>

                    <ChatListItem

                        chat={item}
                        useCase={'chats'}
                        onLongPress={() => onChatItemLongPress(item)}
                        onProfileButtonPress={() => goToChatProfile(item)}


                    />



                }

                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ margin: 60 }} />}

            />


            <ScaleButton
                style={{ width: 60, height: 60, position: 'absolute', borderRadius: 100, bottom: 120, right: 20, ...SHADOWS[colorScheme] }}
                onPress={onNewChatPress}

                color={Colors.accent}

            >
                <CustomImage source={assets.write} style={{ tintColor: Colors.white, width: 28, height: 28 }} />
            </ScaleButton>
        </View >


    )
}

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserChats }, dispatch)



export default connect(null, mapDispatchProps)(Chats)