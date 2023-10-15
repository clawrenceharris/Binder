import { View, ImageBackground, Image, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { assets, Colors } from '../../constants'
import { StatusBar } from 'expo-status-bar'
import Button from '../../components/Button'
import { MediumText } from '../../components/StyledText'
import { getDefaultImage } from '../../utils'
import { ProfileButton } from '../../components'
import { stickers } from '../../constants/stickers'
import { connect, useSelector } from 'react-redux'
import { createChat, sendMessage, updateRecentActivity } from '../../services/chats'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faker } from '@faker-js/faker'
import { saveMediaToStorage } from '../../services/media'
const { width, height } = Dimensions.get('window')
const BOTTOM_BAR_HEIGHT = 150
const EditMediaToSend = ({ navigation, route }) => {
    const { uri, isFront, useCase, chat, isVideo, callback, onSendStart, onSendComplete, onSendError } = route.params
    const [_stickers, setStickers] = useState([])
    const insets = useSafeAreaInsets();

    const imageRef = useRef(null);

    const handleSubmit = () => {
        navigation.pop(2);
        callback(uri);



    }


    const sendByChatId = () => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const path = `message/${chat.id}/${faker.datatype.uuid()}/${filename}`;
        saveMediaToStorage(uri, path).then(url => {
            sendMessage(chat.id, isVideo ? 'video' : 'photo', null, url)
                .then(() => {
                    onSendComplete('Sent!');

                })
                .catch(e => {
                    console.log(e.message);
                    onSendError(e.message);
                });

        })
            .catch(e => {
                console.log(e.message);
                onSendError(e.message);
            });

    }
    const sendByCreatedChat = () => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const path = `message/${chat.id}/${faker.datatype.uuid()}/${filename}`;
        saveMediaToStorage(uri, path).then(url => {
            createChat({ ...chat })
                .then(id => {
                    //add the message to the chat using the id recieved from creating the chat
                    sendMessage(id, isVideo ? 'video' : 'photo', null, url)
                        .then(() => {

                            onSendComplete('Sent!');

                        })
                        .catch(e => {
                            console.warn(e.message);
                            onSendError(e.message);
                        })
                })
                .catch(e => {
                    console.warn(e.message);
                    onSendError(e.message);
                })
        })
            .catch(e => {
                console.warn(e.message);
                onSendError(e.message);
            })

    }
    const handleSend = () => {
        navigation.pop(2);
        onSendStart('Sending...');
        //if we know the chat's id then send the photo or video passing in the id 
        if (chat?.id) {
            sendByChatId();

        }
        //otherwise, create the chat setting the data using the chat data recieved from camera screen
        else {
            sendByCreatedChat();
        }
    }
    return (



        <View style={{ flex: 1 }}>

            <View style={[styles.mainContainer, { paddingTop: insets.top, }]}>
                <StatusBar style='light' />

                <View style={styles.imageContainer}>


                    <Image
                        ref={imageRef}
                        source={{ uri }}
                        style={[styles.image, { transform: isFront ? [{ scaleX: -1 }] : [{ scaleX: 1 }] }]}
                    />


                    <TouchableWithoutFeedback onPress={() => navigation.pop()}>


                        <View style={{ left: 15, top: 15, position: 'absolute', }}>



                            <Image source={assets.close} style={styles.icon} />




                        </View>
                    </TouchableWithoutFeedback>






                </View>




            </View >



            {useCase == 'main' &&
                <View style={styles.bottomBarContainer}>

                    <View style={{ marginHorizontal: 5, height: 40, flex: 0.3, padding: 8, paddingHorizontal: 20, flexDirection: 'row', backgroundColor: '#ffffff30', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>



                        <Image source={assets.down_arrow} style={{ tintColor: Colors.white, width: 28, height: 28 }} />

                    </View>
                    <View style={{ marginHorizontal: 5, height: 40, flex: 1, padding: 8, paddingHorizontal: 20, flexDirection: 'row', backgroundColor: '#ffffff30', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>

                        <MediumText white style={{ marginLeft: 5 }}>Post to</MediumText>
                        <Image source={assets.add} style={{ marginLeft: 5, width: 15, height: 15, tintColor: Colors.white }} />

                    </View>

                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Share')}>


                        <View style={{ marginHorizontal: 5, flex: 1, height: 40, padding: 8, paddingHorizontal: 20, flexDirection: 'row', backgroundColor: Colors.accent, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                            <MediumText white>Send to</MediumText>

                            <Image source={assets.send} style={{ width: 25, height: 25, tintColor: Colors.white, transform: [{ rotate: '45deg' }] }} />

                        </View>
                    </TouchableWithoutFeedback>
                </View>

            }




            {
                useCase == 'single photo to use' &&
                <View style={styles.bottomBarContainer}>
                    <View />
                    <Button
                        style={{ position: 'absolute', bottom: insets.bottom, right: 15 }}
                        title='Use Photo'
                        onPress={handleSubmit}

                    />
                </View >
            }

            {useCase == 'chat' &&
                <View style={styles.bottomBarContainer}>
                    <ProfileButton
                        size={40}
                        animationEnabled={false}
                        disabled
                        imageURL={chat.photoURL}
                        defaultImage={getDefaultImage(chat.type)}
                        showsName
                        name={chat.name}
                        nameStyle={{ color: Colors.white, width: '100%' }}

                    />
                    <Button onPress={handleSend}
                        style={{ paddingHorizontal: 0, width: 50, height: 50 }}
                        icon={<Image source={assets.send} style={{ width: 30, marginRight: 5, height: 30, tintColor: Colors.white, transform: [{ rotate: '45deg' }] }} />}
                    />




                </View>}
        </View>


    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'black',

        paddingHorizontal: 5
    },
    bottomBarContainer: {
        backgroundColor: Colors.dark.invertedTint,
        borderTopWidth: 0,
        borderRadius: 20,
        height: BOTTOM_BAR_HEIGHT - 40,
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        padding: 10,
        justifyContent: 'space-between'
    },
    icon: {
        width: 22,
        height: 22,
        tintColor: Colors.white
    },
    imageContainer: {
        width: '100%',
        height: height - BOTTOM_BAR_HEIGHT,
        overflow: 'hidden',
        borderRadius: 20

    },


    image: {
        position: 'absolute',
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        flex: 1
    },




})

export default EditMediaToSend