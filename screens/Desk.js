import {
    View,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    RefreshControl,
    Dimensions,
    TouchableWithoutFeedback,
    Animated
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { assets, Colors } from '../constants'
import { auth } from '../Firebase/firebase'
import { getDefaultImage, getItemLayout, getResultsFromSearch, haptics } from '../utils'
import useColorScheme from '../hooks/useColorScheme'
import Button from '../components/Button'
import { SHADOWS } from '../constants/Theme'
import { bindActionCreators } from 'redux'
import { connect, useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileButton } from '../components'
import { StatusBar } from 'expo-status-bar'
import SlideModal from '../components/SlideModal'
import { LightText, MediumText, RegularText } from '../components/StyledText'
import { ConfirmationModal } from '../components/Modals'
import CustomImage from '../components/CustomImage'
import MoreButton from '../components/MoreButton'
import { bookmarkDeskItem, deleteUserDeskItem, getDeskRequestStatus, sendDeskRequest, unbookmarkDeskItem } from '../services/desk'
import { addNotification } from '../services/notifications'
import DeskItemThumbnail from '../components/DeskItemThumbnail'
import { fetchUserDesk, fetchUserDeskItems } from '../redux/actions/desk'
import { useDeskItems } from '../hooks/useDeskItems'
import { useUser } from '../hooks/useUser'
import { useBookmarkedItems } from '../hooks/useBookmarkedItems'
import { useSharedDeskItems } from '../hooks/useSharedDeskItems'
import SendButton from '../components/SendButton'
import { useDesk } from '../hooks/useDesk'
import StyledTextInput from '../components/StyledTextInput'
import { ActivityIndicator } from 'react-native'
import OptionsList from '../components/OptionsList'
import ScaleButton from '../components/ScaleButton'


const Desk = (props) => {
    const isCurrentUser = () => {
        return id === auth.currentUser.uid;
    }
    const [showDeskItemModal, setShowDeskItemModal] = useState(false);
    const colorScheme = useColorScheme();
    const [showDeskTypeModal, setShowDeskTypeModal] = useState(false);
    const { height } = Dimensions.get('window');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedDeskItem, setSelectedDeskItem] = useState(null);

    const { currentUser, users } = props;
    const selectionMode = props.selectionMode;
    const { useCase } = props.useCase || props?.route?.params || 'main';
    const [refreshing, setRefreshing] = useState(false);
    const [deskRequestStatus, setDeskRequestStatus] = useState('');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const isMain = props.id != null;
    const deskTypes = ["Notes", "Flashcards", "Study Guide", "Graded Work", "Game", "Other"];
    const id = props.id || props?.route?.params.id;
    const { deskItems } = useDeskItems(id);
    const { bookmarkedItemRefs } = useBookmarkedItems(id);
    const { sharedDeskItemRefs } = useSharedDeskItems(id);
    const [loadingDeskRequest, setLoadingDeskRequest] = useState(false)
    const [bookmarkedItems, setBookmarkedItems] = useState([]);
    const [bookmarkedItemsResults, setBookmarkedItemsResults] = useState([]);

    const [sharedDeskItems, setSharedDeskItems] = useState([]);
    const [sharedDeskItemsResults, setSharedDeskItemsResults] = useState([]);
    const { data: user } = useUser(id);
    const { desk } = useDesk(id);
    const headerOpacity = useRef(new Animated.Value(1)).current
    const [deskItemsResults, setDeskItemsResults] = useState(deskItems);
    const selectionHeaderOpacity = useRef(new Animated.Value(1)).current
    const [search, setSearch] = useState('')
    const Tab = createMaterialTopTabNavigator();


    const handleSearch = (search) => {
        setSearch(search);
        if (!search) {
            setDeskItemsResults(deskItems);
            setBookmarkedItemsResults(bookmarkedItems);
            setSharedDeskItemsResults(sharedDeskItems);

        }
        else {
            setDeskItemsResults(getResultsFromSearch(deskItems, search));
            setBookmarkedItemsResults(getResultsFromSearch(bookmarkedItems, search));
            setSharedDeskItemsResults(getResultsFromSearch(sharedDeskItems, search));
        }
    }

    useEffect(() => {
        setLoading(true);

        if (!isCurrentUser()) {

            getDeskRequestStatus(auth.currentUser.uid, id)
                .then((status) => {

                    setDeskRequestStatus(status);
                    setLoading(false);
                })

        }
        else {
            setLoading(false);

        }


    }, [])
    useEffect(() => {

        setDeskItemsResults(deskItems);
        const bookmarkedItems = [];

        bookmarkedItemRefs.forEach(item => {
            item.get().then(snapshot => {
                const id = snapshot.id;
                const data = snapshot.data();
                bookmarkedItems.push({ id, ...data })
            });




        });
        const sharedItems = [];

        sharedDeskItemRefs.forEach(item => {
            item.get().then(snapshot => {
                const id = snapshot.id;
                const data = item.data();
                sharedItems.push({ id, ...data })
            });
        });
        setBookmarkedItems(bookmarkedItems)
        setBookmarkedItemsResults(bookmarkedItems);

        setSharedDeskItems(sharedItems.filter(item => item.isPublic && !isCurrentUser() || isCurrentUser()));
        setSharedDeskItemsResults(sharedItems.filter(item => item.isPublic && !isCurrentUser() || isCurrentUser()));



    }, [bookmarkedItemRefs, sharedDeskItemRefs, deskItems])

    useEffect(() => {
        if (!selectionMode)
            setSelectedDeskItem(null);


    }, [selectionMode])

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);

    }
    const isBookmarked = () => {
        return bookmarkedItems.includes(selectedDeskItem)
    }
    const onBookmarkPress = () => {

        if (isBookmarked()) {
            unbookmarkDeskItem(selectedDeskItem?.id)
                .then(() => {

                    props.onTaskComplete('Removed from Bookmarks');
                })
                .catch((e) => {


                    props.onTaskComplete(e.message);
                    console.log(e);


                });
        }
        else {

            bookmarkDeskItem(selectedDeskItem?.uid, selectedDeskItem?.id)
                .then(() => {

                    props.onTaskComplete('Bookmarked!')

                })
                .catch((e) => {


                    props.onTaskComplete(e.message);

                });
        }
    }

    const onDeletePress = () => {
        setShowConfirmationModal(true);

    }




    const getLikes = () => {
        let likes = [];
        deskItems.forEach(item => {
            likes = likes.concat(item.likes);
        });
        return likes;
    }

    const getViews = () => {
        let views = [];
        deskItems.forEach(item => {
            views = views.concat(item.views);
        });
        return views;
    }

    const onSharePress = () => {

        if (selectedDeskItem) {
            props.toggleSelectionMode();
            props.navigation.navigate('Share', {
                message: {
                    contentType: 'desk item',
                    specialChatItem: selectedDeskItem,
                    text: null,
                    media: null,

                }
            });
        }

    }
    const onEditPress = () => {
        props.toggleSelectionMode();
        if (selectedDeskItem?.type == "Game") {
            props.navigation.navigate('EditGame', { useCase: 'edit desk item', deskItem: selectedDeskItem });

        }
        else
            props.navigation.navigate('EditDeskItemA', { useCase: 'edit desk item', deskItem: selectedDeskItem });
    }


    const onDeskItemSelected = (item) => {

        if (selectedDeskItem?.id == item.id) {
            return setSelectedDeskItem(null)
        }
        else {

            setSelectedDeskItem(item)
        }
    }
    const hasAccess = () => {
        if (isCurrentUser()) {
            return true;
        }
        if (desk?.isPublic) {
            return true;
        }

        else {
            return deskRequestStatus == 'accepted'
        }






    }

    const TopInfoBar = () => {


        return (
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors[colorScheme].invertedTint, paddingHorizontal: 30, paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors[colorScheme].lightGray }}>
                <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Items', { title: 'Views', useCase: 'users', items: getViews() })}>


                    <View style={{ alignItems: 'center' }}>
                        <MediumText h5 >{desk?.views || 0}</MediumText>
                        <LightText h5 darkgray>{"Views"}</LightText>

                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Items', { title: 'Likes', useCase: 'users', items: getLikes() })}>

                    <View style={{ alignItems: 'center' }}>
                        <MediumText h5 >{desk?.likes || 0}</MediumText>
                        <LightText h5 darkgray>{"Likes"}</LightText>
                    </View>
                </TouchableWithoutFeedback>

                <View style={{ alignItems: 'center' }}>
                    <MediumText h5 >{deskItems?.length || 0}</MediumText>
                    <LightText h5 darkgray>{"Posts"}</LightText>
                </View>
            </View>

        )

    }





    const onDeskOptionPress = (option) => {
        setShowDeskTypeModal(false);

        if (option == "Game") {
            props.navigation.navigate('EditGame', { useCase: 'new desk item' });

        }
        else
            props.navigation.navigate('EditDeskItemA', { useCase: 'new desk item', type: option });


    }

    const handleDeskRequest = () => {
        setLoadingDeskRequest(true);

        sendDeskRequest(auth.currentUser.uid, id)
            .then(() => {
                setLoadingDeskRequest(false);
                addNotification(id, currentUser.uid, currentUser.displayName, 'has requested to view your Desk.', 'desk request');
                getDeskRequestStatus(auth.currentUser.uid, id)
                    .then(res => {

                        setDeskRequestStatus(res);

                    })
            })
            .catch((e) => {
                props.onTaskError(e.message)
                setLoadingDeskRequest(false);

            })
    }

    const handleDeleteDeskItem = () => {
        setShowConfirmationModal(false);
        props.toggleSelectionMode();
        deleteUserDeskItem(selectedDeskItem?.id)
            .catch((e) => props.onTaskError(e.message))
    }



    const DeskItemScreen = ({ data, emptyText, ListHeaderComponent }) => {
        return (

            <View style={{ backgroundColor: Colors[colorScheme].background, paddingTop: 15 }}>

                <SlideModal
                    showModal={showConfirmationModal}
                    toValue={0.5}
                    onCancel={() => setShowConfirmationModal(false)}>

                    <ConfirmationModal

                        onConfirmPress={handleDeleteDeskItem}
                        onCancelPress={() => setShowConfirmationModal(false)}
                        confirmText={"Delete"}
                        message={'Delete ' + selectedDeskItem?.type + '?'}

                    />

                </SlideModal>



                <View style={{ height: '100%', paddingHorizontal: 10 }}>



                    {hasAccess() && !loading ?
                        <FlatList
                            ListHeaderComponent={ListHeaderComponent}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            data={data.filter(item => item.isPublic && !isCurrentUser() || isCurrentUser())}
                            ListEmptyComponent={<MediumText darkgray style={{ textAlign: 'center', alignSelf: 'center', marginTop: 40 }}>{emptyText}</MediumText>}
                            getItemLayout={getItemLayout}
                            numColumns={2}
                            keyExtractor={(item) => item?.id}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator
                            renderItem={({ item }) =>

                                <DeskItemThumbnail
                                    deskItem={item}
                                    onTaskError={props.onTaskError}
                                    deskId={auth.currentUser.uid}
                                    style={{ margin: 5 }}
                                    selectionMode={selectionMode}
                                    isSelected={selectedDeskItem?.id == item.id}
                                    onMorePress={() => {
                                        haptics('light');
                                        props.toggleSelectionMode();

                                        onDeskItemSelected(item);
                                    }}
                                    onPress={() => {
                                        if (selectionMode && isCurrentUser()) {
                                            onDeskItemSelected(item);
                                        }
                                        else
                                            props.navigation.navigate('DeskItem', {
                                                deskItem: item,
                                                deskId: id
                                            })

                                    }}

                                    onLongPress={() => {
                                        if (isCurrentUser()) {
                                            haptics('light');
                                            props.toggleSelectionMode();

                                            onDeskItemSelected(item);
                                        }
                                        else {
                                            setShowDeskItemModal(true);
                                        }

                                    }}


                                />



                            }
                        />
                        :
                        !loading ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: '70%' }}>

                                <CustomImage source={assets.lock} style={{ width: 80, height: 80, tintColor: Colors[colorScheme].darkGray }} />
                                <RegularText verydarkgray style={{ marginTop: 10 }}>{"This Desk is private"}</RegularText>

                                <Button
                                    title={deskRequestStatus != 'pending' ? 'Request Access' : 'Request sent'}
                                    style={{ marginTop: 30 }}
                                    onPress={handleDeskRequest}
                                    loading={loadingDeskRequest}
                                    disabled={deskRequestStatus == 'pending'}
                                />
                            </View>

                            :

                            <ActivityIndicator
                                size="large"
                                style={{ marginTop: 50 }}
                                color={Colors[colorScheme].darkGray}
                            />
                    }


                </View>

            </View >
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].invertedTint }}>
            <StatusBar style={colorScheme == 'light' ? 'dark' : 'light'} />


            <SlideModal
                height={height - ((deskTypes.length + 1) * 50) - 10}
                showModal={showDeskTypeModal}
                onCancel={() => setShowDeskTypeModal(false)}>
                <OptionsList
                    onCancel={() => setShowDeskTypeModal(false)}
                    options={deskTypes}
                    onOptionPress={[onDeskOptionPress]}

                />
            </SlideModal>




            {!isMain && <Header
                title={isCurrentUser() ? 'My Desk' : 'Desk'}
                direction='vertical'
                style={{ backgroundColor: Colors.white }}
            />
            }
            <TopInfoBar />




            {selectionMode &&

                <View style={{ zIndex: 1, bottom: 0, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', height: 100, width: '100%', backgroundColor: Colors[colorScheme].invertedTint, alignItems: 'center', paddingHorizontal: 20, borderTopColor: Colors[colorScheme].gray, borderTopWidth: 1 }}>
                    <TouchableWithoutFeedback
                        disabled={!selectedDeskItem}
                        onPress={onEditPress}>


                        <View style={{ alignItems: 'center' }}>
                            <CustomImage source={assets.pencil_o} style={{ tintColor: Colors[colorScheme].tint, width: 20, height: 20 }} />
                            <RegularText>{'Edit'}</RegularText>

                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        disabled={!selectedDeskItem}
                        onPress={onBookmarkPress}>


                        <View style={{ alignItems: 'center' }}>
                            <CustomImage source={isBookmarked() ? assets.bookmark : assets.bookmark_o} style={{ tintColor: Colors[colorScheme].tint, width: 20, height: 20 }} />
                            <RegularText>{isBookmarked() ? 'Bookmarked' : 'Bookmark'}</RegularText>

                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        disabled={!selectedDeskItem}
                        onPress={onDeletePress}>


                        <View style={{ alignItems: 'center' }}>
                            <CustomImage source={assets.trash} style={{ tintColor: Colors[colorScheme].tint, width: 20, height: 20 }} />
                            <RegularText>{'Delete'}</RegularText>

                        </View>
                    </TouchableWithoutFeedback>


                    <SendButton
                        onPress={onSharePress}

                        animationEnabled={selectedDeskItem != null}

                    />




                </View>}


            {selectionMode && useCase == 'chat' &&
                <View style={{ position: 'absolute', bottom: 0 }}>
                    <Button
                        onPress={onSharePress}
                        style={{ width: 50, height: 50, paddingHorizontal: 0 }}
                        icon={<CustomImage source={assets.send} style={{ tintColor: Colors.white, width: 28, height: 28 }} />}
                    />

                </View>

            }
            <View style={{ padding: 15 }}>


                <StyledTextInput
                    value={search}
                    icon={<CustomImage
                        source={assets.search}
                        style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }} />
                    }
                    onChangeText={handleSearch}
                    placeholder={'Search Desk'}
                />
            </View>
            <Tab.Navigator

                initialRouteName='Owned'

                style={{ marginVertical: 20, marginTop: 0, backgroundColor: Colors[colorScheme].invertedTint }}
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: { backgroundColor: Colors[colorScheme].invertedTint },
                    tabBarActiveTintColor: Colors.accent,
                    tabBarInactiveTintColor: Colors.light.darkGray,
                    tabBarIndicatorStyle: { zIndex: 1, backgroundColor: Colors.accent, height: 5, borderRadius: 25 },
                    tabBarLabelStyle: { fontFamily: 'KanitMedium', textTransform: 'none', fontSize: 16 }

                }}>
                <Tab.Screen

                    options={{

                        tabBarIcon: ({ focused }) =>
                            <ProfileButton
                                defaultImage={getDefaultImage('private')}
                                imageURL={user?.photoURL}
                                size={25} />
                    }}

                    name={"Owned"}

                    children={() =>



                        <DeskItemScreen

                            data={deskItemsResults}
                            emptyText={search ? 'No results' : isCurrentUser() ?

                                "Desk items that you create will appear here." :
                                "Desk items that " + user?.displayName + " creates will appear here."}
                        />}
                />

                <Tab.Screen

                    options={{
                        tabBarIcon: ({ focused }) => <CustomImage
                            source={assets.shared}
                            style={{ width: 25, height: 25, tintColor: focused ? Colors.accent : Colors[colorScheme].darkGray }} />
                    }}
                    name={"Shared"}
                    children={() => <DeskItemScreen
                        data={sharedDeskItemsResults}
                        emptyText={search ? 'No results' : isCurrentUser() ?

                            "Desk items that you didn't create and added to your Desk will appear here." :
                            "Desk items that " + user?.displayName + " didn't create and added to their Desk will appear here."}
                    />}
                />
                <Tab.Screen
                    options={{
                        tabBarIcon: ({ focused }) => <CustomImage
                            source={assets.bookmark}
                            style={{ width: 25, height: 25, tintColor: focused ? Colors.accent : Colors[colorScheme].darkGray }} />
                    }}
                    name="Bookmarked"
                    children={() => <DeskItemScreen
                        data={bookmarkedItemsResults}
                        emptyText={search ? 'No results' : isCurrentUser() ?

                            "Desk items that you Bookmark will appear here." :
                            "Desk items that " + user?.displayName + " Bookmarks will appear here."}
                    />}
                />





            </Tab.Navigator>




            {!selectionMode && isCurrentUser() &&

                <ScaleButton
                    onPress={() => setShowDeskTypeModal(true)}
                    style={{ borderRadius: 50, position: 'absolute', bottom: isMain ? 120 : 30, right: 20, width: 60, height: 60, ...SHADOWS[colorScheme] }}
                    color={Colors.accent}
                >
                    <CustomImage source={assets.add} style={{ width: 20, height: 20, tintColor: 'white' }} />
                </ScaleButton>}



        </View >





    )

}


const styles = StyleSheet.create({
    icon: {
        width: 22,
        height: 22,

    },
    listItemTopContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        boderBottomWidth: 1,
        borderBottomeColor: 'lightgray',
        justifyContent: 'space-between',
        padding: 10
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 15

    },
    listItemBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        padding: 10
    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        boderBottomWidth: 1,
        borderBottomeColor: 'lightgray',

        padding: 10
    },
    listItemText: {
        fontFamily: 'Kanit',
        fontSize: 16,
        marginLeft: 10
    }
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserDesk, fetchUserDeskItems }, dispatch)

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    notes: store.userState.notes,
    flashcards: store.userState.flashcards,
    classes: store.userState.classes,
    desk: store.userState.desk,
    users: store.usersState.users,
    deskItems: store.desksState.deskItems

})

export default connect(mapStateToProps, mapDispatchProps)(Desk)