import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    FlatList,
    Dimensions,
    Animated,
} from 'react-native'
import React, { PureComponent, useEffect, useRef, useState } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Header from '../components/Header'
import { auth } from '../Firebase/firebase'
import { MediumText, RegularText } from '../components/StyledText'
import { Switch } from 'react-native-paper'
import { connect, useSelector } from 'react-redux'
import { ProfileButton } from '../components'
import {
    addSharedDeskItem,
    bookmarkDeskItem,
    deleteSharedDeskItem,
    deleteUserDeskItem,
    getBookmarkedItemById,
    getSharedItemById,
    likeDeskItem,
    unlikeDeskItem,
    unbookmarkDeskItem,
    updateDeskItem,
    updateDeskItemLikes,
    updateDeskItemViews
} from '../services/desk'
import FastImage from 'react-native-fast-image'
import CustomCarousel from '../components/CustomCarousel'
import { useAnimatedStyle } from 'react-native-reanimated'
import Button from '../components/Button'
import AnimatedHeader from '../components/AnimatedHeader'
import SlideModal from '../components/SlideModal'
import OptionsList from '../components/OptionsList'
import { addMessage, fetchChat } from '../services/chats'
import { fetchUser } from '../redux/actions'
import { getDefaultImage, getErrorMessage, haptics } from '../utils'
import moment from 'moment'
import { useUser } from '../hooks/useUser'
import { addNotification } from '../services/notifications'
import Notification from '../components/Notification'
import FlippableFlashcard from '../components/FlippableFlashcard'
import SendButton from '../components/SendButton'
import { ConfirmationModal } from '../components/Modals'
import { useUsersDeskItems } from '../hooks/useUsersDeskItems'
import CustomImage from '../components/CustomImage'
import { SHADOWS } from '../constants/Theme'
import ScaleButton from '../components/ScaleButton'
const DeskItem = (props) => {

    const { deskId } = props.route.params;
    const [deskItem, setDeskItem] = useState(props.route.params.deskItem)
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatList = useRef(null)
    const { width, height } = Dimensions.get('window');
    const { currentUser } = props;
    const [showDeskItemModal, setShowDeskItemModal] = useState(false)
    const colorScheme = useColorScheme();
    const animValue = new Animated.Value(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const chats = useSelector(state => state.chatsState.chats);

    const onViewableItemsChanged = useRef((item) => {
        const index = item?.viewableItems[0]?.index || 0;
        setCurrentIndex(index);

    })

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80
    })
    const [isPublic, setIsPublic] = useState(deskItem.isPublic);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const [currentLikeState, setCurrentLikeState] = useState({
        state: deskItem.likes.includes(currentUser.uid),
        count: deskItem.likes.length
    });

    const { data: user } = useUser(deskItem.uid)



    const isCurrentUser = () => {
        return deskItem.uid == currentUser.uid;
    }

    const onEditPress = () => {
        setShowDeskItemModal(false);

        props.navigation.navigate(deskItem.type != 'Game' ? 'EditDeskItemA' : 'EditGame', {
            deskItem,
            useCase: 'edit desk item',
            onSave: (data) => setDeskItem({ ...deskItem, ...data })
        });
    }

    const onDeletePress = () => {

        setShowDeskItemModal(false);
        setTimeout(() => setShowConfirmationModal(true), 1000);
    }


    const onSharePress = () => {
        haptics('light');
        setShowDeskItemModal(false);
        if (!deskItem.isPublic && !isCurrentUser()) {
            return props.onTaskError('This Desk item is private. Actions are limited.')

        }

        props.navigation.navigate('Share', {
            message: {
                contentType: 'desk item',
                specialChatItem: deskItem,
                text: null,
                media: null,

            },

        });

    }

    const onBookmarkPress = () => {

        setShowDeskItemModal(false);

        if (!deskItem.isPublic && !isCurrentUser()) {

            return props.onTaskError('This Desk item is private. Actions are limited.')
        }
        else if (isBookmarked) {
            setIsBookmarked(false);
            unbookmarkDeskItem(deskItem.id)
                .then(() => {

                    props.onTaskComplete('Removed from Bookmarks');
                })
                .catch((e) => {
                    isBookmarked(true);

                    props.onTaskComplete(e.message);
                    console.log(e);


                });
        }
        else {
            setIsBookmarked(true);
            bookmarkDeskItem(deskItem.uid, deskItem.id)
                .then(() => {

                    props.onTaskComplete('Bookmarked!')

                })
                .catch((e) => {
                    isBookmarked(false);

                    props.onTaskComplete(e.message);

                });
        }

    }
    const onAddPress = () => {

        setShowDeskItemModal(false);

        if (!deskItem.isPublic && !isCurrentUser()) {

            return props.onTaskError('This Desk item is private. Actions are limited.')
        }
        if (isCurrentUser())
            return;

        else if (isAdded) {
            setIsAdded(false);
            deleteSharedDeskItem(deskItem.id)
                .then(() => {

                    props.onTaskComplete('Removed from Desk.')

                })
                .catch((e) => {

                    props.onTaskError(e.message);
                    setIsAdded(true);
                });
        }
        else {

            setIsAdded(true);
            addSharedDeskItem(deskItem.id, deskItem.uid)
                .then(() => {

                    props.onTaskComplete('Added to Desk!')

                })
                .catch((e) => {

                    props.onTaskError(e.message);
                    setIsAdded(false);
                });
        }
    }
    const onLikePress = () => {
        haptics('light');

        if (currentLikeState.state == true) {
            setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
            unlikeDeskItem(deskItem.id, deskItem.uid)

                .catch((e) => {


                    props.onTaskError(e.message);
                    setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
                });

        }
        else {
            setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
            likeDeskItem(deskItem.id, deskItem.uid)

                .catch((e) => {


                    props.onTaskError(e.message);
                    setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
                });
        }

    }
    const handleDelete = () => {
        props.onTaskStart('Deleting...')
        deleteUserDeskItem(deskItem.id)
            .then(() => props.onTaskComplete('Deleted!'))
            .catch((e) => props.onTaskError(getErrorMessage(e)))

    }
    useEffect(() => {
        if (deskItem) {

            if (auth.currentUser.uid != deskItem.uid)
                updateDeskItemViews(deskItem.uid, deskItem.id, deskItem.views.includes(auth.currentUser.uid));

            //set if the desk item is bookmarked or not
            getBookmarkedItemById(deskItem.id)
                .then((res) => setIsBookmarked(res));

            //update the views array for this desk item
            getSharedItemById(deskItem.id)
                .then(res => setIsAdded(res));
        }



    }, [])

    useEffect(() => {
        if (isPublic != deskItem.isPublic)
            updateDeskItem(deskItem.id, { isPublic });
        setDeskItem({ ...deskItem, isPublic })



    }, [showDeskItemModal])


    const toggleIsPublic = () => {
        setIsPublic(!isPublic);
    }
    const onReportPress = () => {
        props.navigation.navigate('SendReport', {
            data: {
                type: 'desk item',
                id: deskItem.id
            },
            title: 'Report',
            useCase: 'report'
        })

    }
    if (!deskItem) {
        return <></>
    }
    return (



        <View style={{
            flex: 1, backgroundColor: Colors[colorScheme].background,


        }}>


            <Header
                backButton={assets.close}
                headerRight={
                    <TouchableWithoutFeedback onPress={() => setShowDeskItemModal(true)}>
                        <CustomImage source={assets.more} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].tint }} />
                    </TouchableWithoutFeedback>
                }
            />
            <SlideModal

                showModal={showConfirmationModal}
                toValue={0.5}
                onCancel={() => setShowConfirmationModal(false)}>
                <ConfirmationModal
                    onConfirmPress={handleDelete}
                    onCancelPress={() => setShowConfirmationModal(false)}
                    confirmText={"Delete"}
                    message={'Delete ' + deskItem.type + '?'}

                />

            </SlideModal>
            <SlideModal
                height={isCurrentUser() ? height - (7 * 50) - 10 : height - (5 * 50) - 10}
                showModal={showDeskItemModal}
                onCancel={() => setShowDeskItemModal(false)}>
                <OptionsList
                    showsIcons={false}
                    onCancel={() => setShowDeskItemModal(false)}

                    options={isCurrentUser() ? [{
                        title: 'Public',
                        rightComponent: <Switch
                            value={isPublic}
                            color={Colors.accent}
                            onValueChange={toggleIsPublic} />
                    },
                    isBookmarked ? 'Unbookmark' : 'Bookmark',
                    isAdded ? 'Remove from My Desk' : 'Add to My Desk',
                        'Edit',
                    {
                        title: 'Share',
                        rightComponent: <SendButton onPress={onSharePress} />
                    },
                        'Delete'
                    ] : [
                        isBookmarked ? 'Unbookmark' : 'Bookmark',
                        isAdded ? 'Remove from My Desk' : 'Add to My Desk',
                        {
                            title: 'Share',
                            rightComponent: <SendButton onPress={onSharePress} />
                        },
                        'Report'
                    ]}
                    onOptionPress={isCurrentUser() ? [toggleIsPublic, onBookmarkPress, onAddPress, onEditPress, onSharePress, onDeletePress] :
                        [onBookmarkPress, onAddPress, onSharePress, onReportPress]}
                />
            </SlideModal>


            <View
                style={{ paddingHorizontal: 15 }}
            >
                <View style={{ justifyContent: (!deskItem.classId || !deskItem.divisionType) ? 'center' : 'space-between', flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>


                    {deskItem.class &&
                        <ProfileButton
                            imageURL={deskItem.class.photoURL}
                            defaultImage={deskItem.class.icon}
                            emoji={deskItem.class.emoji}
                            size={30}
                            colors={deskItem.class?.colors}
                            showsName
                            name={deskItem.class.name}
                            nameStyle={{ fontSize: 16, width: '100%' }}
                        />}

                    {deskItem.divisionNumber && <RegularText darkgray h5 >{deskItem.divisionType + " " + deskItem.divisionNumber}</RegularText>}
                </View>


                <MediumText h3 style={{ alignSelf: 'center', marginTop: 10 }}>{deskItem.title}</MediumText>


                <View style={{ marginTop: 20, height: 350, backgroundColor: deskItem.type == "Game" ? Colors.primary + "50" : null, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>


                    {deskItem.type != 'Flashcards' && deskItem.type != "Game" &&

                        < View style={{ width: width - 30, backgroundColor: 'black', overflow: 'hidden', borderRadius: 15 }}>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                ref={flatList}
                                scrollEnabled
                                horizontal

                                pagingEnabled
                                onViewableItemsChanged={onViewableItemsChanged.current}
                                viewabilityConfig={viewabilityConfig.current}
                                data={deskItem.media}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableWithoutFeedback
                                            onPress={() => props.navigation.navigate('FullScreenMedia', { media: item })}>
                                            <View style={{ width: width - 30, height: 350 }}>
                                                <CustomImage source={{ uri: item }} style={{ width: '100%', height: '100%' }} />


                                            </View>

                                        </TouchableWithoutFeedback>
                                    )
                                }}
                                keyExtractor={item => item}

                            />



                        </View>}

                    {deskItem.type == "Flashcards" &&
                        <View >

                            <FlatList

                                showsHorizontalScrollIndicator={false}
                                ref={flatList}
                                scrollEnabled
                                horizontal

                                pagingEnabled
                                onViewableItemsChanged={onViewableItemsChanged.current}
                                viewabilityConfig={viewabilityConfig.current}
                                data={deskItem.cards}
                                renderItem={({ item }) => (



                                    <FlippableFlashcard

                                        style={{ width: width - 30 }}
                                        card={item} />

                                )}
                                keyExtractor={(_, index) => index}

                            />
                        </View>


                    }

                    {deskItem.type == "Game" &&
                        <ScaleButton onPress={() =>
                            props.navigation.navigate('Game', { game: deskItem })}>

                            <View style={{ flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: 50, padding: 20, alignItems: 'center', justifyContent: 'center' }}>

                                <CustomImage source={assets.play} style={{ width: 30, height: 30, tintColor: Colors.white }} />
                                <MediumText white h3 style={{ marginLeft: 10 }}>Play</MediumText>
                            </View>
                        </ScaleButton>

                    }
                    <View style={{ position: 'absolute', top: 20, right: 20, padding: 10, backgroundColor: Colors.white, ...SHADOWS.dark, shadowColor: '#00000020', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>


                        <CustomImage
                            source={deskItem.isPublic ? assets.unlock : assets.lock}
                            style={{ tintColor: deskItem.isPublic ? Colors.accent : Colors[colorScheme].darkGray, width: 25, height: 25 }}


                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>




                    <TouchableOpacity
                        onPress={onLikePress}
                        activeOpacity={0.7}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <CustomImage
                            source={currentLikeState.state ? assets.heart : assets.heart_o}
                            style={[styles.icon, { tintColor: currentLikeState.state ? Colors.red : Colors[colorScheme].darkGray }]} />
                        {currentLikeState.count > 0 && <MediumText verydarkgray style={{ marginLeft: 5 }}>{currentLikeState.count}</MediumText>}

                    </TouchableOpacity>






                    <TouchableOpacity
                        onPress={onBookmarkPress}

                        activeOpacity={0.7}>

                        <CustomImage
                            tintColor={Colors[colorScheme].darkGray}

                            source={isBookmarked ? assets.bookmark : assets.bookmark_o}
                            style={[styles.icon, { tintColor: Colors[colorScheme].darkGray }]} />
                    </TouchableOpacity>

                    {deskItem.type != "Game" &&
                        <View style={{ marginHorizontal: 40, width: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {deskItem?.media ?
                                deskItem.media.map((_, index) =>
                                    <View
                                        key={index}
                                        style={{ marginRight: 10, width: 100 / deskItem.media.length, height: 5, borderRadius: 50, backgroundColor: index == currentIndex ? Colors.accent : Colors[colorScheme].gray }} />

                                )
                                :
                                deskItem.cards.map((_, index) =>
                                    <View
                                        key={index}
                                        style={{ marginRight: 8, width: 100 / deskItem.cards.length, height: 5, borderRadius: 50, backgroundColor: index == currentIndex ? Colors.accent : Colors[colorScheme].gray }} />

                                )
                            }



                        </View>}


                    <TouchableOpacity
                        onPress={onAddPress}
                        activeOpacity={0.7} >


                        <CustomImage


                            source={isAdded ? assets.desk : assets.desk_o}
                            style={[styles.icon, { tintColor: Colors[colorScheme].darkGray }]} />
                        <View style={{ position: 'absolute', top: -10, left: -15, }}>

                            <CustomImage


                                source={isAdded ? assets.check : assets.add}
                                style={[styles.icon, { width: 15, height: 15, tintColor: Colors[colorScheme].darkGray }]} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSharePress}
                        activeOpacity={0.7}>

                        <CustomImage


                            source={assets.send_o}
                            style={[styles.icon, { tintColor: Colors[colorScheme].darkGray, transform: [{ rotate: '45deg' }] }]} />

                    </TouchableOpacity>




                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 15 }}>

                    <ProfileButton
                        defaultImage={deskItem.isAnonymous && assets.person_gradient.uri}
                        imageURL={deskItem.isAnonymous ? null : user?.photoURL}
                        size={30}
                        showsName
                        name={deskItem.isAnonymous ? 'Someone' : user?.displayName}
                        nameStyle={{ fontSize: 16 }}
                    />


                    <RegularText darkgray h5>{moment(new Date(deskItem.createdAt)).format('MMM DD')}</RegularText>
                </View>
                <View style={{ marginTop: 20, marginBottom: 50, }}>

                    {deskItem.description && <RegularText style={{ marginTop: 10, width: '90%' }}>{deskItem.description}</RegularText>}
                </View>
            </View>
        </View >
    )


}

const styles = StyleSheet.create({
    sectionHeaderText: {
        fontFamily: 'KanitMedium',
        color: 'darkgray',
        fontSize: 18,
        marginVertical: 20
    },


    icon: {
        width: 25,
        height: 25,

    },

})
const mapStateToProps = store => ({
    users: store.usersState.users,
    deskItems: store.desksState.deskItems,
    currentUser: store.userState.currentUser,
    chatrooms: store.userState.chatrooms
})
export default connect(mapStateToProps)(DeskItem)