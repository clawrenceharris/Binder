import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, TouchableWithoutFeedback, TextInput } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { assets, Colors } from '../constants';
import useColorScheme from '../hooks/useColorScheme';
import StyledTextInput from './StyledTextInput';
import { BoldText } from './StyledText';
import ProfileButton from './ProfileButton';
import Button from './Button';
import CustomImage from './CustomImage';
import { useSelector } from 'react-redux';
import SendButton from './SendButton';
import ChatMessage from './ChatMessage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultImage } from '../utils';
import Animated, { FadeIn, FadeOut, Layout, ZoomIn } from 'react-native-reanimated';
import CustomBottomSheet from './CustomBottomSheet';


const ChatInput = ({ inputRef, replyingMessage, onAddPress, setReplyingMessage, onCameraPress, onDeskPress, onSendPress, onBurningQuestionPress, onImagePress, loading, ...props }) => {
    const colorScheme = useColorScheme()
    const currentUser = useSelector(state => state.userState.currentUser);

    const insets = useSafeAreaInsets();
    return (

        <Animated.View
            layout={Layout}
            style={[{ position: 'absolute', width: '100%', bottom: 0, backgroundColor: 'transparent', }]}>
            {replyingMessage &&
                <View

                    style={{ backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10 }}>

                    <View style={{ backgroundColor: Colors[colorScheme].invertedTint, padding: 5, borderWidth: 1, borderColor: Colors[colorScheme].gray, borderRadius: 8, marginBottom: 10, flex: 1, marginRight: 5 }}>
                        <ChatMessage
                            disabled
                            style={{ marginBottom: 0 }}
                            message={replyingMessage}
                            useCase={'reply'} />
                    </View>




                    <TouchableOpacity

                        onPress={() => { setReplyingMessage(null); }}
                        style={{ backgroundColor: Colors[colorScheme].gray, borderRadius: 50, padding: 8, justifyContent: 'center', alignItems: 'center' }}>

                        <Image source={assets.close} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].veryDarkGray }} />
                    </TouchableOpacity>
                </View>



            }

            <View

                style={[styles.container, { paddingBottom: 20, backgroundColor: Colors[colorScheme].invertedTint, borderTopColor: Colors[colorScheme].gray, }]}>

                <TouchableOpacity style={{ backgroundColor: Colors[colorScheme].lightGray, marginRight: 5, borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 40, height: 40 }} onPress={onCameraPress}>
                    <Image source={assets.camera} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray }} />
                </TouchableOpacity>

                <StyledTextInput
                    inputRef={inputRef}
                    containerStyle={{ flex: 1, marginRight: 10 }}
                    multiline
                    enablesReturnKeyAutomatically
                    style={{ maxHeight: 150, paddingLeft: 45 }}
                    icon={

                        <ProfileButton
                            size={35}
                            defaultImage={getDefaultImage('private')}
                            imageURL={currentUser.photoURL}
                        />
                    }
                    {...props}

                />
                <View style={{ width: 30 }}>


                    {props.value || props.content ?
                        <Animated.View
                            exiting={FadeOut}

                            entering={FadeIn.delay(1000)}>
                            <SendButton
                                onPress={onSendPress}
                                size={35}
                                loading={loading}
                                animationEnabled={false}

                            />
                        </Animated.View>
                        :
                        <Animated.View
                            exiting={FadeOut}
                            entering={FadeIn.delay(500)}>

                            <TouchableOpacity onPress={onAddPress}>
                                <Image source={assets.add} style={{ width: 22, height: 22, marginRight: 5, tintColor: Colors[colorScheme].darkGray }} />
                            </TouchableOpacity>

                        </Animated.View>
                    }
                </View>

            </View>


        </Animated.View >

    )
}

const styles = StyleSheet.create({

    container: {
        padding: 15,
        bottom: 0,
        borderTopWidth: 1,

        flexDirection: 'row',
        alignItems: 'center'
    },

    textInput: {
        maxHeight: 200,
        fontSize: 16
    },

    rightContainer: {
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center'
    },
    cameraButton: {
        borderRadius: 50,
        backgroundColor: Colors.accent,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }
})



export default ChatInput