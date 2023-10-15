import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
    Linking,
    Pressable
} from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { assets, Colors } from '../constants'
import ChatInput from '../components/ChatInput'
import { auth, db } from '../Firebase/firebase'
import Header from '../components/Header'
import { ProfileButton } from '../components'
import ChatModal from '../components/ChatModal'
import useColorScheme from '../hooks/useColorScheme'
import ChatMessage from '../components/ChatMessage'
import firebase from 'firebase/compat'
import CustomBottomSheet from '../components/CustomBottomSheet'
import { connect, useSelector } from 'react-redux'
import { ConfirmationModal } from '../components/Modals'
import { capitalize, getDefaultImage, getErrorMessage, getItemLayout, getResultsFromSearch, haptics, openMediaLibrary } from '../utils'
import { createChat, deleteMessage, pinMessage, sendMessage, unpinMessage, updateChat, updateMessage, updateMessageLikes, updateRecentActivity } from '../services/chats'
import { bindActionCreators } from 'redux'
import { fetchMessages } from '../redux/actions/messages'
import { useMessages } from '../hooks/useMessages'
import { saveMediaToStorage } from '../services/media'
import { addNotification } from '../services/notifications'
import { MediumText, RegularText } from '../components/StyledText'
import Button from '../components/Button'
import ScaleButton from '../components/ScaleButton'
import SpecialChatItem from '../components/SpecialChatItem'
import SlideModal from '../components/SlideModal'
import CustomImage from '../components/CustomImage'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown } from 'react-native-reanimated'
import { SIZES } from '../constants/Theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as DocumentPicker from 'expo-document-picker'
import { UNSUPPORTED_FILE_TYPE } from '../constants/ErrorMessages'
import SelectDeskItem from './SelectDeskItem'
import StyledTextInput from '../components/StyledTextInput'
import { useBurningQuestions } from '../hooks/useBurningQuestions'
import BurningQuestion from '../components/BurningQuestion'
import { SectionList } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
// import YouTube from 'react-native-youtube'
const YOUTUBE_API_KEY = "AIzaSyCKnrn2Ob7YGpdzUC3h5j_0PGSQYVyOXZk";
const GIPHY_API_KEY = "P64W80JX3ZEqDFrlBvhIrwpvok7THsxu";
const UNSPLASH_CLIENT_ID = "bZqPWomH3-X7fXoJHioRFkzjrZARjILdBasXZzGqyPs";
const Chat = (props) => {
    const [message, setMessage] = useState({ text: '', specialChatItem: null, contentType: '', deskItem: null, media: null });
    const scrollViewRef = useRef();
    const { photoURL, type, name, users, colors, icon, emoji, user, recentActivity } = props.route.params;
    const [chat, setChat] = useState({
        users,
        type,
        name,
        icon,
        emoji,
        user,
        photoURL,
        colors: typeof colors == 'object' ? colors : null
    });
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [id, setId] = useState(props.route.params?.id);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showChatActionsModal, setShowChatActionsModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showTimestamp, setShowTimestamp] = useState(false);
    const colorScheme = useColorScheme();
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const burningQuestions = useBurningQuestions().burningQuestions.filter(item => item.uid == auth.currentUser.uid);
    const [albums, setAlbums] = useState([]);
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const currentUser = useSelector(state => state.userState.currentUser);
    const { width } = Dimensions.get('window');
    const [files, setFiles] = useState([]);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { height } = Dimensions.get('window');
    const { messages } = useMessages(id);
    const [replyingMessage, setReplyingMessage] = useState(null);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
        //if the current user has not seen the last message and the last message was sent by another user, then mark it as seen
        if (!recentActivity?.seenBy?.includes(auth.currentUser.uid) && recentActivity?.uid != auth.currentUser.uid) {
            updateChat(id, {
                recentActivity: {
                    ...recentActivity,
                    seenBy: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)
                }
            });
        }



    }, [])


    const handleDeleteMessage = (message) => {
        setShowChatActionsModal(false);
        deleteMessage(id, message.id)
            .then(() => {
                sendMessage(id, 'deleted message', 'A message was deleted by the sender', null, null, null, null, true)
                    .catch(e => props.onTaskError(e.message))
            })
            .catch(e => props.onTaskError(e.message))


    }
    const openDocumentPicker = async () => {
        try {
            const doc = await DocumentPicker.getDocumentAsync();
            if (!doc.canceled) {
                const uri = doc.assets[0].uri;
                const isValidFileUri = (/\.(gif|jpe?g|jpg|tiff?|png|webp|bmp|pdf|docx)$/i).test(uri);

                if (isValidFileUri) {
                    setShowAttachmentModal(false);
                    setMessage({ text: '', contentType: 'doc', media: null, doc: doc.assets[0] });
                }
                else
                    props.onTaskError(UNSUPPORTED_FILE_TYPE);


            }
        }
        catch (e) {
            props.onTaskError(e.message);
        }

    }

    const onSendPress = () => {
        //if there is no id (chat does not exist yet) then create it
        if (!id) {
            createChat({
                photoURL: photoURL || null,
                colors: colors || null,
                name: name || null,
                type,
                users,
                isPublic: false,

            })
                .then((id) => {
                    //set the chat id
                    setId(id);
                    handleSend(id);
                })
        }
        else {
            handleSend(id);

        }


    }

    const handleSend = (id) => {
        setLoading(true);

        sendMessage(
            id,
            message.contentType,
            message?.text,
            message?.media,
            message?.specialChatItem,
            message?.doc,
            replyingMessage

        )

            .then((messageId) => {
                setLoading(false);
                if (message.media != null) {
                    const filename = message.media.substring(message.media.lastIndexOf('/') + 1);
                    const path = `message/${messageId}/${filename}`;
                    saveMediaToStorage(message.media, path).then(url => {
                        updateMessage(id, messageId, { media: url });
                    });
                }
            })

            .catch(e => {
                setLoading(false);
                props.onTaskError(e.message)
            });

        setMessage({ text: null, specialChatItem: null, contentType: null, deskItem: null, media: null });
        setReplyingMessage(null);
    }
    const headerLeft = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>

                    <Image source={assets.left_arrow} style={{ marginRight: 10, width: 25, height: 25, tintColor: Colors[colorScheme].tint }} />

                </TouchableWithoutFeedback>

                <ProfileButton
                    size={40}
                    imageURL={chat.type == 'private' ? chat.user?.photoURL || user?.photoURL : chat.photoURL}
                    emoji={chat.emoji}
                    defaultImage={chat.icon || getDefaultImage(chat.type)}
                    onPress={() => props.navigation.navigate('ChatProfile', { id, ...chat, setChat })}
                    name={chat.type == 'private' ? chat.user?.displayName : chat.name}
                    colors={chat.colors}
                    showsName


                />
            </View>
        )
    }



    const onReportPress = () => {

        setShowChatActionsModal(false);
        props.navigation.navigate('SendReport', {
            data: {
                type: 'message',
                id: message.id,
                chatId: id
            },
            title: 'Report',
            useCase: 'report'
        })


    }



    const onReplyPress = () => {

        setShowChatActionsModal(false);
        setReplyingMessage(selectedMessage);

    }

    const onLikePress = (message) => {
        haptics('light');
        updateRecentActivity(id, 'liked a message');
        const currentLikeState = message?.likes?.includes(auth.currentUser.uid);
        updateMessageLikes(currentLikeState, id, message.id)
            .catch((e) => props.onTaskError(getErrorMessage(e.message)))

    }
    const onCameraPress = () => {
        props.navigation.navigate('Camera', {
            chat: {
                id,
                type,
                users,
                name,
                photoURL,
            },

            useCase: 'chat'
        })
    }

    const onPinPress = (item) => {
        setShowChatActionsModal(false);

        if (item.pinned) {
            unpinMessage(id, item.id)
                .catch((e) => {
                    props.onTaskError(getErrorMessage(e))

                })
        }
        else {
            pinMessage(id, item.id)
                .catch((e) => {
                    props.onTaskError(getErrorMessage(e))

                })
        }

    }
    const isItemSelected = image => image == selectedItem;
    const onBurningQuestionPress = () => {
        props.navigation.navigate('NewBurningQuestion', {
            useCase: 'new',
            onSubmit: (data) => setMessage({ contentType: 'burning question', specialChatItem: data, text: null })
        });
    }


    const onItemSelected = image => {
        if (isItemSelected(image)) {
            setSelectedItem(null);
        }
        else {
            setSelectedItem(image);
        }
    }
    useEffect(() => {
        async function fetchAssets() {
            if (hasGalleryPermission) {
                const cameraRoll = await MediaLibrary.getAssetsAsync();
                setFiles(cameraRoll.assets);
            }

        }
        fetchAssets();
    }, [hasGalleryPermission]);

    useEffect(() => {
        async function fetchAlbums() {
            if (hasGalleryPermission) {
                const albums = await MediaLibrary.getAlbumsAsync();
                setAlbums(albums);
            }

        }

        fetchAlbums();
    }, [hasGalleryPermission]);
    const [images, setImages] = useState([]);
    const [gifs, setGifs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const fetchImages = () => {
            const url = `https://api.unsplash.com/search/photos?query=${searchQuery || "random"}&client_id=${UNSPLASH_CLIENT_ID}`
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const images = data.results.map(item => ({ uri: item.urls.regular }));
                    setImages(images);

                })
                .catch(e => console.log(e))

        }
        const fetchGifs = () => {
            const url = `https://api.giphy.com/v1/gifs/search?q=${searchQuery || "random"}&api_key=${GIPHY_API_KEY}`
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const gifs = data.data.map(gif => ({ uri: gif.images.original.url }))
                    setGifs(gifs);

                })
                .catch(e => console.log(e))
        }
        const fetchVideos = () => {

            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery || "random"}&key=${YOUTUBE_API_KEY}`
            fetch(url)
                .then(response => response.json())
                .then(data => setVideos(data.items.map(item => ({ ...item, uri: item.snippet.thumbnails.default.url }))))
                .catch(e => console.log(e))
        }
        fetchGifs();
        fetchImages();
        fetchVideos();
    }, [searchQuery])
    const [burningQuestionSearch, setBurningQuestionSearch] = useState('')
    const [routes] = useState([
        { key: 'first', title: "GIF's" },
        { key: 'second', title: 'Images' },
        //{ key: 'third', title: 'Videos' },
    ]);

    const MediaScreen = ({ data, useCase }) => {
        const mediaWidth = useCase == 'videos' || useCase == 'gifs' ? width / 2 - 2 : width / 3 - 2;
        const mediaHeight = useCase == 'videos' || useCase == 'gifs' ? width / 2 - 50 : width / 3 - 2;


        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    renderItem={({ item }) =>
                        <View>
                            <ScaleButton onPress={() => onItemSelected(item)}>


                                <View style={{ width: mediaWidth, height: mediaHeight, margin: 1, borderRadius: 5, overflow: 'hidden' }}>
                                    <CustomImage source={item} style={{ width: '100%', height: '100%' }} />
                                    {isItemSelected(item) && <View style={{ position: 'absolute', resizeMode: useCase == 'videos' && 'contain', bottom: 10, right: 10, backgroundColor: Colors.accent, borderRadius: 25, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                                        <CustomImage source={assets.check} style={{ width: 10, height: 10, tintColor: Colors.white }} />

                                    </View>}


                                </View>



                            </ScaleButton>
                        </View>
                    }
                    data={data}
                    keyExtractor={item => item.uri}
                    ListFooterComponent={<View style={{ height: 400 }} />}
                    getItemLayout={getItemLayout}
                    numColumns={useCase == 'videos' || useCase == 'gifs' ? 2 : 3}
                />

            </View>
        )
    }

    const renderScene = SceneMap({
        first: () => <MediaScreen data={gifs} useCase='gifs' />,
        second: () => <MediaScreen data={images} useCase='images' />,
        third: () => <MediaScreen data={videos} useCase='videos' />
    });
    const [index, setIndex] = useState(0);

    const renderBottomSheetContent = () => {
        const getTitle = () => {
            switch (currentScreenIndex) {
                case 0: return 'Photo Libray';
                case 1: return 'Desk';
                case 2: return 'Burning Question';
                case 3: return 'Search Media';
            }
        }

        return (
            <View style={{ borderTopColor: Colors[colorScheme].gray, borderTopWidth: 1, flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <MediumText h3 style={{ textAlign: 'center' }}>{getTitle()}</MediumText>

                    <TouchableOpacity style={{ position: 'absolute', right: 0, top: 0, marginHorizontal: 15 }} onPress={() => setShowAttachmentModal(false)}>
                        <Image source={assets.close} style={{ width: 18, height: 18, tintColor: Colors[colorScheme].tint }} />
                    </TouchableOpacity>
                </View>


                <View style={{ marginTop: 15, marginHorizontal: 15, justifyContent: 'space-between', flexDirection: 'row', borderRadius: 15, padding: 10, backgroundColor: Colors[colorScheme].lightGray }}>


                    <TouchableOpacity
                        style={{ marginRight: 20, alignItems: 'center' }}
                        onPress={() => {
                            setCurrentScreenIndex(0);
                            setSelectedItem(null);

                        }}>
                        <Image
                            source={assets.image}
                            style={{ width: 25, height: 25, tintColor: currentScreenIndex == 0 ? Colors.accent : Colors[colorScheme].darkGray }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginRight: 20, }}
                        onPress={() => {
                            setCurrentScreenIndex(1);
                            setSelectedItem(null);
                        }}>
                        <Image
                            source={assets.desk}
                            style={{ width: 25, height: 25, tintColor: currentScreenIndex == 1 ? Colors.accent : Colors[colorScheme].darkGray }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginRight: 20, }}
                        onPress={() => {
                            setCurrentScreenIndex(2);
                            setSelectedItem(null);

                        }}>
                        <Image
                            source={assets.burning_question}
                            style={{ width: 25, height: 25, tintColor: currentScreenIndex == 2 ? Colors.accent : Colors[colorScheme].darkGray }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginRight: 20, }}
                        onPress={() => {
                            setCurrentScreenIndex(3);
                            setSelectedItem(null);


                        }}>
                        <Image
                            source={assets.search}
                            style={{ width: 25, height: 25, tintColor: currentScreenIndex == 3 ? Colors.accent : Colors[colorScheme].darkGray }} />
                    </TouchableOpacity>
                </View>


                {currentScreenIndex == 1 &&
                    <SelectDeskItem onSubmit={(data) => {
                        setMessage({ text: '', contentType: 'desk item', specialChatItem: data });
                        setShowAttachmentModal(false);
                    }} />


                }
                {currentScreenIndex == 3 &&
                    <View style={{ flex: 1 }}>
                        <MediumText
                            accent={selectedItem}
                            h4
                            style={{ alignSelf: 'flex-end', margin: 15 }}
                            disabled={!selectedItem}
                            darkgray={!selectedItem}
                            onPress={() => {
                                setSelectedItem(null);
                                setMessage({ contentType: 'gif', media: selectedItem });
                                setShowAttachmentModal(false);
                            }}>Add</MediumText>

                        <View style={{ paddingHorizontal: 15, paddingBottom: 10 }} >
                            <StyledTextInput
                                placeholder={index == 0 ? "Search GIF's" : "Search Images"}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                returnKeyType={'search'}

                            />

                        </View>

                        <TabView
                            renderScene={renderScene}
                            navigationState={{ index, routes }}
                            onIndexChange={setIndex}
                            initialLayout={{ width, height: 50 }}

                            renderTabBar={(props) =>
                                <TabBar
                                    {...props}

                                    labelStyle={{ color: Colors[colorScheme].tint, fontFamily: 'AvenirNext-Medium' }}
                                    indicatorStyle={{ backgroundColor: Colors.accent, borderRadius: 25, height: 5 }}
                                    style={{ width: '90%', alignSelf: 'center' }}
                                    indicatorContainerStyle={{ backgroundColor: Colors[colorScheme].invertedTint }}>

                                </TabBar>

                            }
                        />




                    </View>

                }
                {currentScreenIndex == 2 &&
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>




                        {burningQuestions.length ?
                            <View >
                                <MediumText
                                    accent={selectedItem}
                                    h4
                                    style={{ alignSelf: 'flex-end', margin: 15 }}
                                    disabled={!selectedItem}
                                    darkgray={!selectedItem}
                                    onPress={() => {
                                        setSelectedItem(null);
                                        setMessage({ contentType: 'burning question', specialChatItem: selectedItem });
                                        setShowAttachmentModal(false);
                                    }}>Add</MediumText>
                                <View style={{ padding: 15 }}>
                                    <StyledTextInput
                                        placeholder={'Search Burning Questions'}
                                        value={burningQuestionSearch}
                                        onChangeText={setBurningQuestionSearch}

                                    />
                                </View>


                                {!burningQuestionSearch ?
                                    <View>

                                        <MediumText h4 style={{ marginLeft: 15, marginBottom: 10, marginTop: 20 }}>{"Recents"}</MediumText>
                                        <View style={{ alignItems: 'center' }}>
                                            <FlatList
                                                pagingEnabled
                                                data={burningQuestions.filter(item => new Date() - item.createdAt <= 1000 * 60 * 60 * 24 * 7)}
                                                renderItem={({ item }) =>
                                                    <View>

                                                        <BurningQuestion
                                                            bq={item}
                                                            onPress={() => onItemSelected(item)}

                                                            showsBottomActionBar={false}
                                                            useCase={'chat'}
                                                            containerStyle={{ width: width - 30, alignSelf: 'center' }}
                                                        />
                                                        {isItemSelected(item) && <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: Colors.accent, borderRadius: 25, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                                                            <CustomImage source={assets.check} style={{ width: 10, height: 10, tintColor: Colors.white }} />
                                                        </View>}
                                                    </View>


                                                }
                                                horizontal
                                                keyExtractor={item => item.id}
                                            />
                                        </View>
                                        <MediumText h4 style={{ marginLeft: 15, marginBottom: 10, marginTop: 25 }}>{"All"}</MediumText>
                                        <View style={{ alignItems: 'center' }}>

                                            <FlatList
                                                data={burningQuestions}
                                                renderItem={({ item }) =>
                                                    <View>
                                                        <BurningQuestion
                                                            showsBottomActionBar={false}
                                                            bq={item}
                                                            onPress={() => onItemSelected(item)}
                                                            useCase={'chat'}
                                                            containerStyle={{ width: width - 30 }}
                                                        />
                                                        {isItemSelected(item) && <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: Colors.accent, borderRadius: 25, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                                                            <CustomImage source={assets.check} style={{ width: 10, height: 10, tintColor: Colors.white }} />
                                                        </View>}

                                                    </View>

                                                }
                                                keyExtractor={item => item.id}
                                            />
                                        </View>

                                    </View>
                                    :
                                    <FlatList
                                        data={getResultsFromSearch(burningQuestions, burningQuestionSearch)}
                                        renderItem={({ item }) => <BurningQuestion
                                            bq={item}
                                            showsBottomActionBar={false}
                                            useCase={'chat'}
                                            containerStyle={{ width: width - 30 }} />}
                                        keyExtractor={item => item.id}
                                        ListEmptyComponent={<MediumText h4 darkgray>No Results</MediumText>}
                                    />
                                }
                            </View>

                            :

                            <RegularText verydarkgray style={{ textAlign: 'center', marginHorizontal: 30 }}>
                                {"Send a Burning Question to get your problem noticed and recieve quicker answers!"}
                            </RegularText>}

                        <Button
                            onPress={() => {
                                setShowAttachmentModal(false);
                                onBurningQuestionPress();
                            }}
                            style={{ marginBottom: 35 }}
                            title={"New Burning Question"} />
                    </View>}








                {currentScreenIndex == 0 &&
                    <View >


                        <MediumText
                            accent={selectedItem}
                            h4
                            style={{ alignSelf: 'flex-end', margin: 15 }}
                            disabled={!selectedItem}
                            darkgray={!selectedItem}
                            onPress={() => {
                                setSelectedItem(null);
                                setMessage({ contentType: 'photo', media: selectedItem });
                                setShowAttachmentModal(false);
                            }}>Add</MediumText>



                        <ScrollView>

                            <View style={{ flexDirection: 'row' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        props.navigation.navigate('Camera', { callback: (image) => setMessage({ contentType: 'photo', media: image }), useCase: 'single photo to use' })
                                        setShowAttachmentModal(false);
                                    }}
                                    style={{ borderRadius: 5, margin: 1, width: width / 3 - 2, height: width / 3 - 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.tint }}>
                                    <Image source={assets.camera} style={{ width: 25, height: 25, tintColor: Colors.white }} />

                                    <MediumText h5 white style={{ textAlign: 'center', marginTop: 10 }}>Camera</MediumText>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => openMediaLibrary(setSelectedItem)}
                                    style={{ borderRadius: 5, margin: 1, width: width / 3 - 2, height: width / 3 - 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.tint }}>
                                    <Image source={assets.image} style={{ width: 25, height: 25, tintColor: Colors.white }} />

                                    <MediumText h5 white style={{ textAlign: 'center', marginTop: 10 }}>Photo Albums</MediumText>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={openDocumentPicker}
                                    style={{ borderRadius: 5, margin: 1, width: width / 3 - 2, height: width / 3 - 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.tint }}>
                                    <Image source={require('../assets/icons/document.png')} style={{ width: 25, height: 25, tintColor: Colors.white }} />

                                    <MediumText h5 white style={{ textAlign: 'center', marginTop: 10 }}>Documents</MediumText>

                                </TouchableOpacity>

                            </View>

                            {hasGalleryPermission ?

                                <FlatList
                                    scrollEnabled={false}
                                    renderItem={({ item }) =>
                                        <ScaleButton onPress={() => onItemSelected(item.uri)}>


                                            <View style={{ width: width / 3 - 2, height: width / 3 - 2, margin: 1, borderRadius: 5, overflow: 'hidden' }}>
                                                <CustomImage source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} />
                                                {isItemSelected(item.uri) && <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: Colors.accent, borderRadius: 25, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                                                    <CustomImage source={assets.check} style={{ width: 10, height: 10, tintColor: Colors.white }} />

                                                </View>}
                                            </View>
                                        </ScaleButton>
                                    }
                                    data={files}
                                    keyExtractor={item => item.uri}
                                    getItemLayout={getItemLayout}
                                    numColumns={3}
                                />
                                :
                                <View style={{ marginTop: 20 }}>
                                    <RegularText h4 style={{ textAlign: 'center' }}>{"Allow Binder to access your photos."}</RegularText>
                                    <MediumText
                                        h4
                                        accent
                                        onPress={() => Linking.openSettings()}
                                        style={{ textAlign: 'center', marginTop: 10 }}>{"Open Settings"}</MediumText>


                                </View>}
                            <View style={{ height: 100 }} />
                        </ScrollView>
                    </View>
                }
            </View>

        )
    }

    const onAddPress = () => {

        Keyboard.dismiss();
        setShowAttachmentModal(true);
        if (!hasGalleryPermission) {
            getGalleryPermissions();
        }

    }
    const getGalleryPermissions = async () => {

        if (!hasGalleryPermission) {
            const galleryStatus = await MediaLibrary.getPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status == 'granted');

        }


    }


    const getContent = () => {
        if (message?.specialChatItem) {
            return (<SpecialChatItem useCase={'edit'} message={message} />)
        }
        else if (message?.media) {
            if (message.contentType == 'gif') {
                return (<View style={{ width: 175, height: 130, borderRadius: 10, overflow: 'hidden' }}>
                    <Image source={{ uri: message.media }} style={{ width: '100%', height: '100%' }} />
                </View>)
            }
            else {
                return (
                    <View style={{ width: 130, height: 150, borderRadius: 10, overflow: 'hidden' }}>
                        <Image source={{ uri: message.media }} style={{ width: '100%', height: '100%' }} />
                    </View>
                )
            }
        }
        else if (message?.doc) {
            if (message.doc.mimeType == 'application/pdf') {

            }
            else if (message.doc.mimeType == 'image/jpg' || message.doc.mimeType == 'image/png' || message.doc.mimeType == 'image/jpeg' || message.doc.mimeType == 'image/tiff') {
                return (
                    <View style={{ width: 130, height: 150, borderRadius: 10, overflow: 'hidden' }}>
                        <Image source={{ uri: message.doc.uri }} style={{ width: '100%', height: '100%' }} />
                    </View>)
            }
            else if (message.doc.mimeType == 'image/gif') {
                return (<View style={{ width: 150, height: 130, borderRadius: 10, overflow: 'hidden' }}>
                    <Image source={{ uri: message.doc.uri }} style={{ width: '100%', height: '100%' }} />
                </View>)
            }

        }


    }


    return (


        <GestureHandlerRootView style={{ flex: 1 }}>



            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
                <Header
                    headerLeft={headerLeft()}
                    border
                    headerLeftStyle={{ width: '100%', paddingHorizontal: 15 }}


                />

                <ChatModal
                    visible={showChatActionsModal}
                    onCancel={() => { setShowChatActionsModal(false); setSelectedMessage(null) }}
                    message={selectedMessage}
                    onPinPress={() => onPinPress(selectedMessage)}
                    onReplyPress={onReplyPress}
                    startValue={0}
                    onDeletePress={() => handleDeleteMessage(selectedMessage)}
                    onReportPress={onReportPress}

                />
                <SlideModal
                    toValue={0.5}
                    onCancel={() => setShowConfirmationModal(false)}
                    showModal={showConfirmationModal}>


                    <ConfirmationModal
                        message={'Are you sure you want to discard this message?'}
                        onConfirmPress={() => { setShowConfirmationModal(false); setMessage({ text: '', contentType: '', specialChatItem: null }) }}
                        onCancelPress={() => setShowConfirmationModal(false)}
                    />
                </SlideModal>
                <View style={{ zIndex: showAttachmentModal ? 2 : -1, position: 'absolute', height: '100%', width: '100%' }}>


                    <CustomBottomSheet

                        show={showAttachmentModal}
                        onDismiss={() => setShowAttachmentModal(false)}
                        snapPoints={[height - 100]}
                        style={{ shadowOpacity: 0 }}
                        showsHeaderHandle={false}
                    >
                        {renderBottomSheetContent()}
                    </CustomBottomSheet>
                </View>



                <KeyboardAvoidingView
                    style={styles.keyboardAvoidContainer}
                    behavior={Platform.OS == "ios" ? "height" : "height"}>

                    <FlatList
                        ListFooterComponent={<View style={{ height: inputRef.current?.isFocused() ? 200 : 120 }} />}
                        ListHeaderComponent={<View style={{ margin: 10 }} />}
                        data={messages}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        onScrollBeginDrag={() => setShowTimestamp(true)}
                        keyboardDismissMode='interactive'
                        keyExtractor={item => item?.id || Math.random(10 ** 10)}
                        onScrollEndDrag={() => setTimeout(() => setShowTimestamp(false), 2000)}
                        renderItem={({ item, index }) =>

                            <ChatMessage
                                useCase='chat'
                                style={{ marginHorizontal: 10 }}
                                showTimestamp={showTimestamp}
                                message={item}
                                messages={messages}
                                nextMessage={index < messages.length ? messages[index + 1] : null}
                                onLongPress={() => { setSelectedMessage(item); setShowChatActionsModal(true) }}
                                previousMessage={index > 0 ? messages[index - 1] : null}
                                onLikePress={() => onLikePress(item)}
                                chatId={id}
                                onPinPress={() => onPinPress(item)}
                            />
                        }
                    />


                    <ChatInput
                        inputRef={inputRef}
                        setContent={(value) => setMessage({
                            contentType: '',
                            text: null,
                            specialChatItem: typeof value == 'object' && value,
                            media: typeof value == 'string' && value
                        })}
                        onAddPress={onAddPress}
                        placeholder={replyingMessage ? 'Reply' : 'Send a message'}
                        loading={loading}
                        replyingMessage={replyingMessage}
                        setReplyingMessage={setReplyingMessage}
                        onDiscardPress={() => setShowConfirmationModal(true)}
                        onCameraPress={onCameraPress}
                        onSendPress={onSendPress}
                        value={message.text}
                        photoURL={currentUser.photoURL}
                        content={getContent()}
                        deskItem={message.deskItem}
                        onChangeText={(text) => setMessage({ text, contentType: 'text' })}


                    />



                </KeyboardAvoidingView>





            </View>


        </GestureHandlerRootView>

    )
}






const styles = StyleSheet.create({

    keyboardAvoidContainer: {
        flex: 1,

    },
    container: {
        flex: 1
    },
    icon: {
        tintColor: Colors.light.tint,
        width: 30,
        height: 30

    },
    classHeader: {
        padding: 30,
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },

    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        width: '60%'

    },
    bottomSheetHeader: {
        borderTopLeftRadius: 20,
        padding: 20,
        borderTopRightRadius: 20,

    }
})
const mapStateToProps = store => ({
    currentUser: store.userState.currentUser,
    chatrooms: store.userState.chatrooms,
    school: store.schoolState.school,
    messages: store.messagesState.messages,

})
const mapDispatchProps = dispatch => bindActionCreators({ fetchMessages }, dispatch)
export default connect(mapStateToProps, mapDispatchProps)(Chat)