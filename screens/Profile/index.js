import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Dimensions,
    Platform,
    Text,
    Image,
    ScrollView,
    Animated
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { assets, Colors } from '../../constants';
import useColorScheme from '../../hooks/useColorScheme';
import { ChatListItem, ProfileButton } from '../../components';
import { SHADOWS } from '../../constants/Theme';
import moment from 'moment';
import { auth } from '../../Firebase/firebase';
import { getDefaultImage, getItemLayout, getProfileItemsSubtitle, getZodiacSign, openMediaLibrary } from '../../utils';
import { connect, useDispatch, useSelector } from 'react-redux';
import { TwelvePointBurst } from '../../components/shapes';
import { ActivityIndicator } from 'react-native-paper';
import { BoldText, LightText, MediumText, RegularText } from '../../components/StyledText';
import { styles } from './styles';
import { addFriend, getFriendRequestStatus, unAddFriend } from '../../services/friends';
import ScaleButton from '../../components/ScaleButton';
import { fetchUser, updateUser } from '../../services/user';
import CustomImage from '../../components/CustomImage';
import SlideModal from '../../components/SlideModal';
import { SubmitModal } from '../../components/Modals';
import StyledTextInput from '../../components/StyledTextInput';
import { descriptions } from '../Settings';
import Button from '../../components/Button';
import AnimatedHeader from '../../components/AnimatedHeader';
import { fetchMessages, getChatByUid, getSharedChats } from '../../services/chats';
import ProfileItemsButton from '../../components/ProfileItemsButton';
import { useNavigation } from '@react-navigation/native';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase/compat';
import OptionsList from '../../components/OptionsList';
import Notification from '../../components/Notification';
import { addStudyBuddy, removeStudyBuddy } from '../../services/studyBuddies';
import { useBurningQuestions } from '../../hooks/useBurningQuestions';
import { saveMediaToStorage } from '../../services/media';
import { addNotification } from '../../services/notifications';
import { USER_FRIENDS } from '../../redux/constants';
const MIN_HEIGHT = Platform.OS === 'ios' ? 0 : 55


const Profile = (props) => {
    const insets = useSafeAreaInsets();
    const MAX_HEIGHT = 330 + insets.top;

    const [user, setUser] = useState(null);
    const { currentUser, users } = props;
    const [showProfileItemModal, setShowProfileItemModal] = useState(false);
    const [modal, setModal] = useState(null);
    const [showEditNameModal, setShowEditNameModal] = useState(false);
    const { height, width } = Dimensions.get('window');
    const colorScheme = useColorScheme();
    const zodiacEmoji = getZodiacSign(new Date(user?.birthday).getDate(), new Date(user?.birthday).getMonth(), true);
    const zodiacSign = getZodiacSign(new Date(user?.birthday).getDate(), new Date(user?.birthday).getMonth(), false);
    const date = user?.birthday ? new Date(user?.birthday) : null;
    const birthday = moment(date).format("MMM DD, YYYY");
    const friends = useSelector(state => state.userState.friends).map(item => item?.uid);
    const studyBuddies = useSelector(state => state.userState.studyBuddies).map(item => item?.uid);

    const [loadingFriend, setLoadingFriend] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const uid = props.uid || props.route.params.uid;
    const isMain = props.uid != null;
    const [sharedChats, setSharedChats] = useState([]);
    const [chat, setChat] = useState(null);
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const [showImageOptionModal, setShowImageOptionModal] = useState(false)
    const burningQuestions = useBurningQuestions().burningQuestions.filter(item => item.uid == uid && !item.isAnonymous);
    const [showModal, setShowModal] = useState(false);
    const [loadingStudyBuddy, setLoadingStudyBuddy] = useState(false);
    const isCurrentUser = () => {
        return uid === auth.currentUser.uid;
    }
    const isFriend = () => {
        return friends.includes(user.uid);
    }
    const isStudyBuddy = () => {
        return studyBuddies.includes(user.uid);
    }
    const getSubtitle = (message, data, isPossesive, isExclaimatory) => {
        let subtitle = '';
        let pronoun = '';
        const punctuation = isExclaimatory ? "!" : ".";

        if (isCurrentUser()) {
            pronoun = isPossesive ? "Your" : "You";
            subtitle = pronoun + " " + message + " " + data + punctuation;

        }
        else {
            if (user?.displayName) {
                pronoun = isPossesive ? user?.displayName + "'s" : user?.displayName;
            }
            else {
                pronoun = isPossesive ? "Their" : "They";
            }

            subtitle = pronoun + " " + message + " " + data + punctuation;
        }


        return subtitle;
    }

    const data = [

        {
            id: '0',
            emoji: "🏫",
            title: "School",

            subtitle: getSubtitle("go to", user?.school?.name, false, false),
            data: user?.school?.name


        },
        {
            id: '1',
            emoji: "🎓",
            title: "Graduation Year",
            onPress: () => props.navigation.navigate('GraduationYearSettings', { gradYear: user?.gradYear }),
            subtitle: getSubtitle(isCurrentUser() ? "graduate in" : "graduates in", user?.gradYear, false, false),
            data: user?.gradYear ? user.gradYear : isCurrentUser() ? "Edit" : null

        },
        {
            id: '2',
            emoji: "💯",
            title: "GPA",
            onPress: () => props.navigation.navigate('GPASettings', { gpa: user?.gpa }),
            data: user?.gpa ? user.gpa : isCurrentUser() ? "Edit" : null,
            subtitle: getSubtitle("gpa is", user?.gpa, true, false),

        },
        {
            id: '3',
            emoji: "🎂",
            title: "Birthday",
            onPress: () => props.navigation.navigate('BirthdaySettings', { birthday: user.birthday }),

            subtitle: getSubtitle("birthday is on", birthday, true, true),
            data: date ? moment(date).format("MMM DD, YYYY") : null

        },
        {
            id: '4',
            emoji: zodiacEmoji,
            title: "Astrology",
            onPress: () => props.navigation.navigate('BirthdaySettings', { birthday: user.birthday }),

            subtitle: getSubtitle(isCurrentUser() ? "are a" : "is a", zodiacSign, false, true),
            data: date ? zodiacSign : null

        },
    ];


    useEffect(() => {

        if (isCurrentUser()) {


            setUser(currentUser); // set the user to this current user


        }
        else {
            const user = users.find(user => user.uid == uid)
            if (user) {
                setUser(user)
            }
            else {


                fetchUser(uid)
                    .then((user) => {
                        setUser(user);


                        getChatByUid(uid)
                            .then((chat) => {
                                if (chat) {
                                    setChat({
                                        id: chat.id,
                                        name: user.displayName,
                                        photoURL: user.photoURL,
                                        type: 'private',
                                        users: [user.uid, auth.currentUser.uid]
                                    })

                                }
                                else {
                                    setChat({
                                        name: user.displayName,
                                        photoURL: user.photoURL,
                                        type: 'private',
                                        users: [user.uid, auth.currentUser.uid]
                                    })
                                }

                            });

                    });
            }
            getSharedChats(uid)
                .then((res) => {
                    setSharedChats(res);
                });




        }

    }, [uid, currentUser]);



    const profileItemModal = (emoji, title, subtitle,) => (
        <View style={{ alignItems: 'center', backgroundColor: Colors[colorScheme].invertedTint, padding: 20, borderRadius: 20 }}>
            <View style={[styles.emojiContainer, {
                ...SHADOWS[colorScheme],
                backgroundColor: Colors[colorScheme].lightGray,
                borderColor: '#00000030'
            }]}>

                <RegularText h2>{emoji}</RegularText>
            </View>

            <View>
                <BoldText
                    h4
                    tint
                    style={{ marginTop: 20 }}>
                    {title}
                </BoldText>

            </View>
            <View>
                <RegularText
                    darkgray
                    style={{ textAlign: 'center', marginTop: 10 }}>
                    {subtitle}
                </RegularText>

            </View>

            <TouchableWithoutFeedback
                onPress={() => { setShowProfileItemModal(false) }}
            >
                <View style={[styles.profileItemCloseBtn, { backgroundColor: Colors[colorScheme].lightGray, }]}>
                    <MediumText h4 accent>{"Close"}</MediumText>
                </View>
            </TouchableWithoutFeedback>


        </View>



    );

    const onAddFriendPress = () => {
        setShowModal(false);

        if (!isFriend()) {
            setLoadingFriend(true);
            addFriend(uid)
                .then(() => {
                    setLoadingFriend(false);

                    addNotification(
                        uid,
                        currentUser.uid,
                        currentUser.displayName,
                        'added you as a friend',
                        'added friend',
                        {
                            name: 'Profile',
                            params: { uid }
                        }
                    );
                })
                .catch((e) => {
                    setLoadingFriend(true);

                    props.onTaskError(e.message)
                });
        }
        else {

            unAddFriend(uid)
                .catch((e) => props.onTaskError(e.message))
        }
    }

    const onChatPress = () => {

        if (!isCurrentUser() && chat?.id) {
            const state = props.navigation.getState();
            if (state.index < 3) {

                props.navigation.navigate('Chat', {
                    ...chat
                });

            }


        }
        else
            props.navigation.navigate('Chat', chat);


    }


    const HeaderRight = () => {
        return (
            <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
                <CustomImage source={assets.more} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].tint }} />
            </TouchableWithoutFeedback>
        )
    }

    const onCameraPress = () => {
        props.navigation.navigate('Camera', {
            callback: null,
            chat,
            useCase: 'chat'
        })
    }
    const onDeskPressed = () => {
        props.navigation.navigate('Desk', { id: user.uid })
    }
    const onStudyBuddyPress = () => {
        setLoadingStudyBuddy(true);

        if (!isStudyBuddy()) {

            addStudyBuddy(user.uid)
                .then(() => setLoadingStudyBuddy(false))
                .catch((e) => {
                    props.onTaskError(e.message);
                    setLoadingStudyBuddy(false);
                })

        }
        else {

            removeStudyBuddy(user.uid)
                .then(() => setLoadingStudyBuddy(false))
                .catch((e) => {
                    props.onTaskError(e.message);
                    setLoadingStudyBuddy(false);
                })
        }

    }
    const onUploadPhotoPress = () => {
        openMediaLibrary(setHeaderImage);

    }


    const onProfileButtonPress = () => {
        if (isCurrentUser())
            setShowImageOptionModal(true)
        else
            props.navigation.navigate('FullScreenMedia', { media: user.photoURL ? user.photoURL : getDefaultImage('private') })
    }
    const onProfileItemPress = (item) => {
        setModal(profileItemModal(item.emoji, item.title, item.subtitle));
        setShowProfileItemModal(true);
    }
    const onReportPress = () => {
        setShowModal(false);
        props.navigation.navigate('SendReport', {
            title: 'Report',
            useCase: 'report',

            data: {
                id: user.uid,
                type: 'user',
            }
        })
    }
    const onSettingsPress = () => {
        setShowModal(false);

        props.navigation.navigate('Settings');
    }
    const setProfileImage = (image) => {
        props.onTaskStart('Saving...');
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const path = `profile/${auth.currentUser.uid}/${filename}`;

        saveMediaToStorage(image, path)
            .then((url) => {
                updateUser({ photoURL: url })
                    .then(() => {
                        props.onTaskComplete('Saved!');
                    })
                    .catch((e) => props.onTaskError(e.message))

            })
            .catch((e) => props.onTaskError(e.message))


    }
    const onTakePhotoPress = (callback) => {
        setShowImageOptionModal(false);

        props.navigation.navigate('Camera', {
            useCase: 'single photo to use',
            callback
        })
    }
    const setHeaderImage = (image) => {
        props.onTaskStart('Saving...');
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const path = `profile/${auth.currentUser.uid}/${filename}`;
        saveMediaToStorage(image, path)
            .then((url) => {
                updateUser({ headerImage: url })
                    .then(() => {
                        props.onTaskComplete('Saved!');
                    })
                    .catch((e) => props.onTaskError(e.message))

            })
            .catch((e) => props.onTaskError(e.message))


    }
    if (!user) {
        return (

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={Colors.accent} />
            </View>
        )
    }
    return (

        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} >


            {!isMain &&
                <AnimatedHeader
                    animatedValue={scrollY}
                    navigation={props.navigation}
                    headerRight={<HeaderRight />}
                    inputRange={[410, 430]}
                    animatedTitle={user.displayName}
                    titleInputRange={[MAX_HEIGHT + 50, 460]}
                />}

            {loading && <View style={{ justifyContent: 'center', alignItems: 'center', zIndex: 1, flex: 1, width: '100%', height: '100%', position: 'absolute', backgroundColor: '#00000030' }}>
                <ActivityIndicator style={{ zIndex: 2 }} color='white' />
            </View>}


            <SlideModal
                showModal={showEditNameModal}
                onCancel={() => setShowEditNameModal(false)}
                toValue={0.5}

            >
                <SubmitModal
                    title={"Edit Name"}
                    subtitle={descriptions.name}
                    onCancelPress={() => setShowEditNameModal(false)}
                    onSubmitPress={() => {
                        setLoading(true);
                        setShowEditNameModal(false);
                        updateUser(auth.currentUser.uid, {
                            displayName
                        })
                            .then(() => setLoading(false))

                    }}


                >
                    <StyledTextInput
                        placeholder='Name'
                        value={displayName}
                        onChangeText={setDisplayName}

                    />
                </SubmitModal>
            </SlideModal>
            <SlideModal
                showModal={showProfileItemModal}
                onCancel={() => setShowProfileItemModal(false)}
                toValue={0.5}
            >
                {modal}
            </SlideModal>

            <SlideModal
                showModal={showImageOptionModal}
                onCancel={() => setShowImageOptionModal(false)}
                height={height - (3 * 50) - 20}

            >
                <OptionsList
                    onCancel={() => setShowImageOptionModal(false)}
                    options={['Upload Photo', 'Take Photo']}
                    onOptionPress={[() => openMediaLibrary(setProfileImage), () => onTakePhotoPress(setProfileImage)]}


                />
            </SlideModal>

            <SlideModal
                showModal={showModal}
                onCancel={() => setShowModal(false)}
                height={isCurrentUser() ? height - (2 * 50) - 10 : height - (3 * 50) - 10}

            >
                <OptionsList
                    onCancel={() => setShowModal(false)}
                    options={isCurrentUser() ? ['Settings'] : [!isFriend() ? 'Add Friend' : 'Remove Friend', 'Report']}
                    onOptionPress={isCurrentUser() ? [onSettingsPress] : [onAddFriendPress, onReportPress]}


                />
            </SlideModal>

            <ImageHeaderScrollView

                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
                minHeight={0}
                maxHeight={MAX_HEIGHT}
                contentContainerStyle={{ borderRadius: 20, backgroundColor: Colors[colorScheme].background }}
                renderTouchableFixedForeground={() => (



                    isCurrentUser() &&
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 15, right: 15, }}>

                        <TouchableWithoutFeedback onPress={() => onTakePhotoPress(setHeaderImage)}>


                            <View style={{ marginRight: 10, width: 40, height: 40, backgroundColor: '#00000070', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <CustomImage source={assets.camera_o} style={{ width: 28, height: 28, tintColor: Colors.white }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={onUploadPhotoPress}>


                            <View style={{ width: 40, height: 40, backgroundColor: '#00000070', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <CustomImage source={assets.image} style={{ width: 28, height: 28, tintColor: Colors.white }} />
                            </View>
                        </TouchableWithoutFeedback>


                    </View>

                )}
                renderHeader={() => {
                    return (
                        user?.headerImage ?
                            <View

                                style={{ width, height: MAX_HEIGHT }}>
                                <CustomImage source={{ uri: user.headerImage }} style={{ width: '100%', height: '100%' }} />
                            </View>

                            :
                            <View style={{ backgroundColor: Colors[colorScheme].lightGray, width, height: MAX_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
                                <CustomImage source={assets.person} style={{ width: '70%', height: '70%', tintColor: Colors[colorScheme].darkGray }} />
                            </View>

                    )
                }}>


                <TriggeringView

                    style={{ paddingHorizontal: 15 }}>


                    {isFriend() && !isStudyBuddy() &&
                        <View style={[styles.calloutContainer, { position: 'absolute', width: 250, top: 10, right: 15, backgroundColor: Colors[colorScheme].veryDarkGray }]}>

                            <RegularText white>{"Add " + user.displayName + " as a Study Buddy!"}</RegularText>
                            <View style={{ position: 'absolute', top: 30, right: 30, width: 15, height: 15, backgroundColor: Colors[colorScheme].veryDarkGray, transform: [{ rotate: '45deg' }] }}></View>
                        </View>}
                    <View style={[styles.profileHeaderContentContainer, { marginTop: isFriend() && !isStudyBuddy() ? 60 : 20, backgroundColor: Colors[colorScheme].invertedTint, ...SHADOWS[colorScheme] }]}>


                        {isFriend() && !isCurrentUser() &&
                            <TouchableOpacity
                                onPress={onStudyBuddyPress}
                                style={[styles.studyBuddyContainer, { backgroundColor: isStudyBuddy() ? Colors.accent : Colors[colorScheme].lightGray }]}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', }}>


                                    {isStudyBuddy() && !loadingStudyBuddy &&

                                        <CustomImage source={assets.check} style={{ width: 15, height: 15, tintColor: Colors.white }} />

                                    }
                                    {!isStudyBuddy() && !loadingStudyBuddy &&
                                        <CustomImage source={assets.add} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].darkGray }} />

                                    }
                                    {loadingStudyBuddy &&
                                        <ActivityIndicator color={isStudyBuddy() ? Colors.white : Colors[colorScheme].veryDarkGray} />
                                    }
                                    {!loadingStudyBuddy &&
                                        <Text style={{ fontSize: 22, marginLeft: 5 }}>🤓</Text>
                                    }
                                </View>
                            </TouchableOpacity>}

                        <View style={styles.profileImageContainer}>
                            <View style={{ flexDirection: 'row' }}>

                                <TwelvePointBurst
                                    colors={['#793BB9', '#65319B']}
                                    size={85}
                                    style={{ ...SHADOWS[colorScheme], shadowColor: '#00000060' }}
                                >

                                    <TwelvePointBurst
                                        colors={['#944CD7', Colors.primary]}
                                        size={80}
                                        style={{ position: 'absolute', left: 1 }}>

                                        <ProfileButton
                                            onLongPress={() => props.navigation.navigate('FullScreenMedia', { media: user.photoURL || getDefaultImage('private') })}
                                            onPress={onProfileButtonPress}
                                            size={80}
                                            defaultImage={assets.person_gradient.uri}
                                            style={{ position: 'absolute' }}
                                            imageContainerStyle={{ borderWidth: 2, borderColor: Colors.white }}
                                            imageURL={user.photoURL}
                                            defaultImageStyle={{ top: 6 }}


                                        />

                                    </TwelvePointBurst>
                                </TwelvePointBurst>

                                <View>

                                    <View style={styles.nameContainer}>



                                        <TouchableWithoutFeedback
                                            disabled={!isCurrentUser()}
                                            onPress={() => setShowEditNameModal(true)}>
                                            <View >


                                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>


                                                    <MediumText
                                                        h3
                                                        tint={user.displayName}
                                                        gray={!user.displayName}
                                                        numberOfLines={1}>

                                                        {displayName || user.displayName || 'Display Name'}
                                                    </MediumText>



                                                    {isCurrentUser() &&

                                                        <CustomImage
                                                            source={assets.pencil}
                                                            style={[styles.pencilIcon, { tintColor: Colors[colorScheme].tint, }]}
                                                        />
                                                    }
                                                </View>
                                                <RegularText
                                                    h5
                                                    darkgray>
                                                    {"@" + user.username}
                                                </RegularText>
                                            </View>
                                        </TouchableWithoutFeedback>

                                    </View>
                                </View>
                            </View>
                        </View>



                        <FlatList
                            data={data}
                            style={{ marginTop: 25 }}
                            getItemLayout={getItemLayout}
                            numColumns={3}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) =>
                                item.data &&
                                <TouchableOpacity
                                    onPress={() => item.data == "Edit" ? item.onPress() : onProfileItemPress(item)}
                                    style={[styles.profileItemContainer, { borderColor: Colors[colorScheme].lightGray }]}>
                                    <LightText
                                        lightgray
                                        h5
                                        style={{ textAlign: 'center' }}>
                                        {item.emoji + " " + item.data}
                                    </LightText>

                                    <TouchableWithoutFeedback onPress={item.onPress}>
                                        <CustomImage source={assets.pencil_o} style={{ marginLeft: 8, width: 15, height: 15, tintColor: Colors[colorScheme].veryDarkGray }} />
                                    </TouchableWithoutFeedback>

                                </TouchableOpacity>
                            }
                        />
                        {isFriend() && !isCurrentUser() &&
                            <View style={styles.quickActionsContainer}>



                                <View style={{ alignItems: 'center' }}>
                                    <Button
                                        onPress={onCameraPress}
                                        animationEnabled={false}
                                        style={{ width: 50, height: 50, paddingHorizontal: 0 }}

                                        icon={<CustomImage
                                            source={assets.camera}
                                            style={styles.quickActionIcon}

                                        />}

                                    />

                                    <RegularText verydarkgray>{"Clip"}</RegularText>
                                </View>


                                <View style={{ alignItems: 'center' }}>

                                    <Button
                                        onPress={onChatPress}
                                        style={{ width: 50, height: 50, paddingHorizontal: 0 }}
                                        animationEnabled={false}
                                        icon={<CustomImage
                                            source={assets.chat_bubble}
                                            style={styles.quickActionIcon}
                                            tintColor={Colors.white}

                                        />}

                                    />
                                    <RegularText verydarkgray>{"Chat"}</RegularText>

                                </View>


                                <View style={{ alignItems: 'center' }}>

                                    <Button
                                        onPress={onDeskPressed}
                                        animationEnabled={false}
                                        style={{ width: 50, height: 50, paddingHorizontal: 0 }}

                                        icon={<CustomImage
                                            source={assets.desk}
                                            style={styles.quickActionIcon}
                                            tintColor={Colors.white}

                                        />}

                                    />

                                    <RegularText verydarkgray>{"Desk"}</RegularText>

                                </View>


                            </View>}

                    </View>





                    {!isFriend() && !isCurrentUser() &&
                        <ScaleButton onPress={onAddFriendPress}>


                            <View style={{ marginTop: 20, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent, width: '100%', borderRadius: 25, padding: 10 }}>

                                {!loadingFriend ?
                                    <CustomImage source={assets.add_friend} style={{ tintColor: Colors.white, width: 22, height: 22, marginRight: 10 }} />
                                    :
                                    <ActivityIndicator color='white' style={{ marginRight: 10 }} />
                                }
                                <MediumText white h4>{"Add Friend"}</MediumText>


                            </View>

                        </ScaleButton>}





                    {!isCurrentUser() &&

                        <View style={[styles.sharedChatsContainer, { ...SHADOWS[colorScheme], backgroundColor: Colors[colorScheme].invertedTint, }]}>

                            <ProfileItemsButton
                                items={sharedChats}
                                title={"Shared Chats"}
                                subtitle={getProfileItemsSubtitle(sharedChats, "Shared Chat")}
                                source={assets.chat_bubble}
                                isBottom
                                isTop
                            />



                        </View>
                    }
                    <View style={[styles.sharedChatsContainer, { ...SHADOWS[colorScheme], backgroundColor: Colors[colorScheme].invertedTint, }]}>

                        <ProfileItemsButton
                            items={burningQuestions.map(item => item.id)}
                            source={assets.burning_question}
                            title={"Burning Questions"}
                            subtitle={getProfileItemsSubtitle(burningQuestions, "Burning Question")}
                            colors={[Colors.yellow, Colors.red]}
                            isTop
                            isBottom
                        />
                    </View>


                    <View style={{ height: 150 }} />

                </TriggeringView>
            </ImageHeaderScrollView>

        </View >


    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    chatrooms: store.userState.chatrooms,
    studyBuddies: store.userState.studyBuddies,
    friends: store.userState.friends,
    rank: store.userState.rank,
    users: store.usersState.users

})


export default connect(mapStateToProps, null)(Profile)