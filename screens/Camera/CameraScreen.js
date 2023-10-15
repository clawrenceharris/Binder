import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Linking,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { assets, Colors } from '../../constants'
import { SHADOWS } from '../../constants/Theme'
import * as ImagePicker from 'expo-image-picker'
import CameraButton from '../../components/CameraButton'
import { doubleTap, haptics } from '../../utils'
import { auth, db } from '../../Firebase/firebase'
import { MediumText, RegularText } from '../../components/StyledText'
import Button from '../../components/Button'
import { connect } from 'react-redux'
import useColorScheme from '../../hooks/useColorScheme'
import { ScrollView } from 'react-native'
import { styles } from './styles'
import CustomImage from '../../components/CustomImage'
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const MAX_VIDEO_DURATION = 10000

const CameraScreen = (props) => {
    const insets = useSafeAreaInsets();
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(false);
    const cameraRef = useRef(null);
    const { chat, callback, useCase, onSendStart, onSendComplete, onSendError } = props.route.params;
    const [galleryItems, setGalleryItems] = useState([]);
    const [lastTap, setLastTap] = useState(null);
    const [mediaCollection, setMediaCollection] = useState([]);
    const scaleValue = useRef(new Animated.Value(0)).current;
    const [isVideo, setIsVideo] = useState(false);


    const handleDoubleTap = () => {

        if (type == Camera.Constants.Type.back) {
            setType(Camera.Constants.Type.front)

        }
        if (type == Camera.Constants.Type.front) {
            setType(Camera.Constants.Type.back)
            haptics('light')
        }


    }

    const handleMediaCaptured = (uri) => {
        if (useCase == 'single photo to use' || useCase == 'chat') {
            props.navigation.navigate('EditMediaToSend', {
                useCase,
                uri,
                chat,
                onSendStart,
                onSendComplete,
                onSendError,
                isVideo,
                callback,
                isFront: type == Camera.Constants.Type.front
            })
        }

        else if (useCase == 'post' || useCase == 'multiple photos to use') {
            setMediaCollection([...mediaCollection, uri])
        }



    }
    const onFlipPressed = () => {
        if (type == Camera.Constants.Type.back) {
            setType(Camera.Constants.Type.front)
            haptics('light')
        }
        if (type == Camera.Constants.Type.front) {
            setType(Camera.Constants.Type.back)
            haptics('light')
        }
    }

    useEffect(() => {

        const getPermissions = async () => {

            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted')

            if (galleryStatus.status === 'granted') {
                const userGalleryMedia = await MediaLibrary.getAssetsAsync({ sortBy: ['creationTime'], mediaType: ['photo', 'video'] })
                setGalleryItems(userGalleryMedia.assets)
            }


        };
        setTimeout(() => {
            getPermissions();
        }, 1000);
        setTimeout(() => {
            Animated.sequence([

                Animated.spring(scaleValue, {
                    duration: 300,
                    toValue: 1,
                    useNativeDriver: true
                }),


            ]).start()
        }, 500);

    }, [])
    const recordVideo = async () => {

        if (cameraRef) {
            try {
                const options = { maxDuration: MAX_VIDEO_DURATION, quality: Camera.Constants.VideoQuality['480'] }
                const videoRecordPromise = cameraRef.current.recordAsync(options)

                if (videoRecordPromise) {
                    const data = await videoRecordPromise;
                    setIsVideo(true);
                    handleMediaCaptured(data.uri);




                }
            } catch (e) {
                console.alert(e)
            }
        }


    }


    const onDeskPress = () => {
        props.navigation.navigate('SelectDeskItem', {
            onSubmit: (deskItem) => setMediaCollection(deskItem.media)

        })

    }

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                haptics('light');
                handleMediaCaptured(data.uri);
            } catch (e) {
                console.warn(e)
            }
        }
    }


    const onSendPress = () => {
        props.navigation.navigate('Share', {
            onSubmit: () => props.navigation.navigate('Chats'),
            message: { contentType: 'media array', media: mediaCollection }
        });

    }


    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            selectionLimit: 3
        });

        if (!result.canceled && result != null) {
            handleMediaCaptured(result.uri)

        }

    }
    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>


            <View

                style={styles.cameraContainer}
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => {

                }}

                onResponderGrant={() => doubleTap(500, lastTap, setLastTap, handleDoubleTap)}>


                {!hasCameraPermission &&

                    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <MediumText h3 white>{"Allow Binder to access your camera."}</MediumText>
                        <Button
                            title="Open Settings"
                            colors={[Colors.white, Colors.white]}
                            tint={Colors.accent}
                            style={{ marginTop: 20 }}
                            onPress={() => Linking.openSettings()}
                        />

                    </View>

                }


                <Camera
                    style={styles.camera}
                    type={type}
                    flashMode={flashMode}
                    ref={cameraRef}
                    ratio={'16:9'}


                >
                    {useCase != 'main' ?
                        <View style={{ top: 15, left: 15, zIndex: 1 }}>



                            <TouchableWithoutFeedback onPress={() => props.navigation.goBack()} >

                                <Image source={assets.close} style={styles.icon} />
                            </TouchableWithoutFeedback>



                        </View>
                        :
                        <></>}
                    <View style={{ right: 15, top: 15, position: 'absolute', backgroundColor: '#00000050', borderRadius: 25, padding: 10, alignItems: 'center' }}>

                        <TouchableOpacity onPress={onFlipPressed}>
                            <Image source={assets.flip} style={[styles.icon, { width: styles.icon.width + 5, height: styles.icon.height + 5 }]} />
                        </TouchableOpacity>



                        <TouchableOpacity
                            style={styles.sideBarIcon}
                            onPress={() => { setFlashMode(!flashMode) }}>

                            {!flashMode &&
                                <Image
                                    source={assets.flash_off}
                                    style={styles.icon} />}
                            {flashMode &&
                                <Image
                                    source={assets.flash}
                                    style={styles.icon} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sideBarIcon}
                            onPress={onDeskPress}>
                            <Image source={assets.desk} style={[styles.icon]} />
                        </TouchableOpacity>



                        <TouchableOpacity
                            style={[styles.sideBarIcon, styles.galleryButton]}
                            onPress={pickFromGallery}
                        >


                            {galleryItems[0] == undefined
                                ?
                                <></>
                                :
                                <Image source={{ uri: galleryItems[0].uri }} style={styles.galleryButtonImage} />
                            }
                        </TouchableOpacity>



                    </View>
                </Camera>

                {chat && <View style={styles.sendToContainer}>
                    <MediumText h3 white>Send to</MediumText>
                    <MediumText h4 white>{chat.name}</MediumText>

                </View>}

                <View style={styles.bottomContianer}>

                    <ScrollView style={{ height: 150 }} horizontal showsHorizontalScrollIndicator={false}>


                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginBottom: 20 }}>
                            {mediaCollection.map((uri) => (
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />


                                    <TouchableOpacity
                                        onPress={() => setMediaCollection(mediaCollection.filter(item => item != uri))}
                                        style={{ borderRadius: 25, backgroundColor: Colors.red, position: 'absolute', top: 5, justifyContent: 'center', alignItems: 'center', right: 5, padding: 5 }}>

                                        <Image source={assets.close} style={{ width: 10, height: 10, tintColor: Colors.white }} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' }}>

                        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>


                            <TouchableOpacity
                                // onLongPress={canRecord && recordVideo}
                                delayLongPress={500}
                                onPress={takePicture}
                                disabled={mediaCollection.length >= 4}

                            >


                                <Image

                                    source={assets.camera_button}
                                    style={{ width: 90, height: 90, marginHorizontal: 15, tintColor: mediaCollection.length == 4 ? Colors.light.veryDarkGray : null }} />
                            </TouchableOpacity>
                        </Animated.View>


                        {mediaCollection.length > 0 && useCase == 'main' &&
                            <Button

                                icon={<CustomImage tintColor={Colors.white} source={assets.send} style={{ marginRight: 5, width: 28, height: 28, tintColor: Colors.white, transform: [{ rotate: '45deg' }] }} />}
                                style={{ position: 'absolute', right: 20, width: 40, maxHeight: 40, paddingHorizontal: 0 }}
                                onPress={onSendPress}



                            />}

                        {useCase == 'multiple photos to use' && <TouchableOpacity
                            onPress={() => { callback(mediaCollection); props.navigation.goBack() }}
                            style={{ position: 'absolute', right: 10, backgroundColor: '#00000060', borderRadius: 25, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={assets.check} style={{ width: 10, height: 10, tintColor: Colors.white, marginRight: 10 }} />
                            <RegularText white h4>{"Done"}</RegularText>

                        </TouchableOpacity>}
                    </View>
                </View>

            </View>

        </View >

    );


}


export default CameraScreen