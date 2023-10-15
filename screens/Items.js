import { View, Text, FlatList, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import useColorScheme from '../hooks/useColorScheme'
import Header from '../components/Header'
import { assets, Colors } from '../constants'
import UserListItem from '../components/UserListItem'
import { SHADOWS } from '../constants/Theme'
import { MediumText } from '../components/StyledText'
import { auth } from '../Firebase/firebase'
import { connect, useSelector } from 'react-redux'
import { capitalize, getItemLayout, getResultsFromSearch, handleAddFriend } from '../utils'
import Button from '../components/Button'
import CustomImage from '../components/CustomImage'
import ChatMessage from '../components/ChatMessage'
import { ChatListItem } from '../components'
import { getChatByUid } from '../services/chats'
import { fetchUser } from '../services/user'
import { ActivityIndicator } from 'react-native-paper'
import SlideModal from '../components/SlideModal'
import { ConfirmationModal } from '../components/Modals'
import StyledTextInput from '../components/StyledTextInput'
import DeskItemThumbnail from '../components/DeskItemThumbnail'
import BurningQuestion from '../components/BurningQuestion'
import { useUsersDeskItems } from '../hooks/useUsersDeskItems'
import { useBurningQuestions } from '../hooks/useBurningQuestions'
import BQAnswer from '../components/BQAnswer'
import useUsers from '../hooks/useUsers'

const Items = (props) => {

    const colorScheme = useColorScheme()
    const { title, useCase, canNavigate, onRemovePress } = props.route.params;
    const { currentUser } = props;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const { users } = useUsers();
    const [items, setItems] = useState(props.route.params.items);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [search, setSearch] = useState('');
    const [itemsResults, setItemsResults] = useState(items);
    const { deskItems } = useUsersDeskItems();
    const { burningQuestions } = useBurningQuestions();
    const handleRemove = () => {
        setItems(items.filter(el => (el.uid && el.uid != itemToRemove.uid) || (el.id && el.id == itemToRemove.id)));
        onRemovePress(itemToRemove);
    }
    useEffect(() => {
        if (useCase == 'members' || useCase == 'users') {
            const array = [];
            props.route.params.items.forEach(uid => {
                const user = users.find(item => item.uid == uid);
                if (user && !array.map(item => item.uid).includes(uid))
                    array.push(user);
                setItems(array);
                setItemsResults(array);




            })
        }
        else if (useCase == 'burning questions') {
            const array = [];
            props.route.params.items.forEach(id => {
                const burningQuestion = burningQuestions.find(item => item.id == id);
                if (burningQuestion && !array.includes(burningQuestion))
                    array.push(burningQuestion);
                setItems(array);
                setItemsResults(array);




            })
        }

        else if (useCase == 'desk items') {
            const array = [];
            props.route.params.items.forEach(id => {
                const deskItem = deskItems.find(item => item.id == id);
                if (deskItem && !array.includes(deskItem))
                    array.push(deskItem);

                setItems(array);
                setItemsResults(array);



            })

        }


    }, [deskItems, burningQuestions])


    const handleSearch = (value) => {
        setSearch(value);
        if (value)
            setItemsResults(getResultsFromSearch(items, value));


        else
            setItemsResults(items)

    }

    const RenderItem = ({ item, index }) => {
        if (useCase == 'members' || useCase == 'users') {
            return (

                <UserListItem
                    disabled={!canNavigate}
                    onPress={() => props.navigation.navigate('Profile', { uid: item.uid })}
                    user={item}
                    onTaskError={props.onTaskError}
                    onTaskComplete={props.onTaskComplete}
                    onTaskStart={props.onTaskStart}
                    useCase={'user'}
                />
            )
        }

        else if (useCase == 'chats') {
            return (
                <ChatListItem
                    disabled
                    profileButtonDisabled
                    useCase={'shared chats'}
                    chat={item}
                />

            )
        }
        else if (useCase == 'media') {
            return (
                <TouchableWithoutFeedback onPress={() => props.navigation.navigate('FullScreenMedia', { media: item })}>

                    <View style={{ width: 110, height: 150, overflow: 'hidden', borderRadius: 8, margin: 5 }}>
                        <CustomImage source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
                    </View>
                </TouchableWithoutFeedback>

            )
        }

        else if (useCase == 'messages') {
            return (
                <View style={{ paddingHorizontal: 15 }}>


                    <ChatMessage message={item} specialChatItems={[...burningQuestions, ...deskItems]} canLike={false} />
                </View>

            )
        }
        else if (useCase == 'desk items') {
            return (
                <View style={{ padding: 15 }}>


                    <DeskItemThumbnail
                        deskItem={item}
                    />
                </View>

            )
        }
        else if (useCase == 'burning questions') {
            return (
                <View style={{ paddingHorizontal: 15 }}>


                    <BurningQuestion
                        bq={item}
                        user={users.find(user => user.uid == item.uid)}
                        containerStyle={{ width: '100%' }}
                        style={{ marginBottom: 20 }}
                        useCase={'profile'}
                    />
                </View>

            )
        }
        else if (useCase == 'bq answers') {
            return (
                <View style={{ paddingHorizontal: 15 }}>


                    <BQAnswer
                        answer={item}
                        containerStyle={{ width: '100%' }}
                        style={{ marginBottom: 20 }}
                        useCase={'profile'}
                        user={users.find(user => user.uid == item.uid)}
                    />
                </View>

            )
        }

    }

    if (loadingItems) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
                <Header
                    title={title}
                    navigation={props.navigation}
                />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                    <ActivityIndicator color={Colors.accent} />
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header
                title={title}
                navigation={props.navigation}
            />
            <SlideModal
                onCancel={() => setShowConfirmationModal(false)}
                showModal={showConfirmationModal}
                toValue={0.5} >
                <ConfirmationModal
                    onConfirmPress={() => {
                        handleRemove();
                        setShowConfirmationModal(false);
                    }}
                    confirmText={"Remove"}
                    message={"Remove " + (itemToRemove?.name || itemToRemove?.displayName) + "?"}
                    onCancelPress={() => setShowConfirmationModal(false)}
                />
            </SlideModal>
            <View style={{ paddingHorizontal: 15 }}>


                {useCase != 'media' &&
                    <StyledTextInput
                        value={search}
                        onChangeText={handleSearch}
                        icon={<CustomImage
                            source={assets.search}
                            style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }} />
                        }
                        placeholder={'Search'}
                    />
                }
            </View>
            <View style={{ marginTop: 20, alignItems: useCase == 'media' ? 'center' : null, height: '100%' }}>

                {/* <Text style={{ fontFamily: 'KanitMedium', color: Colors[colorScheme].tint, marginBottom: 10, fontSize: 18 }}>{"Members (" + items.length + ")"}</Text> */}

                <FlatList
                    getItemLayout={getItemLayout}
                    numColumns={useCase == 'media' ? 3 : 1}
                    ListFooterComponent={<View style={{ margin: 50 }} />}
                    data={itemsResults}
                    ListEmptyComponent={<MediumText darkgray h4 style={{ textAlign: 'center', marginTop: 40 }}>{'No results'}</MediumText>}
                    renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
        </View>
    )
}
const mapStateToProps = store => ({
    currentUser: store.userState.currentUser
})
export default connect(mapStateToProps)(Items)