import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../constants/index';
import moment from 'moment';
import useColorScheme from '../hooks/useColorScheme';
import { doubleTap, getDisplayNameOrYou, getItemLayout } from '../utils';
import BurningQuestion from './BurningQuestion';
import { LightText, MediumText, RegularText } from './StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { fetchUser } from '../services/user';
import DeskItemThumbnail from './DeskItemThumbnail';
import { useUser } from '../hooks/useUser';
import BQAnswer from './BQAnswer';
import { useBurningQuestions } from '../hooks/useBurningQuestions';
import { useDeskItems } from '../hooks/useDeskItems';
import { useSelector } from 'react-redux';
import ScaleButton from './ScaleButton';
import CustomImage from './CustomImage';
import { auth } from '../Firebase/firebase';



const ChatMessage = ({ previousMessage, id, messages, message, disabled, nextMessage, onLikePress, useCase, onLongPress, showTimestamp, onPinPress, style, ...props }) => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [lastTap, setLastTap] = useState(null);
    const specialChatItemUser = useUser(message.specialChatItem?.uid).data;
    const [bq, setBq] = useState(null);
    const users = useSelector(state => state.usersState.users);
    const [deskItem, setDeskItem] = useState(null);
    const { burningQuestions } = useBurningQuestions();
    const { deskItems } = useDeskItems(message.specialChatItem?.uid);
    const messageDate = new Date(message.createdAt);
    useEffect(() => {
        if (!bq) {
            const bq = burningQuestions.find(item => item.id == message?.specialChatItem?.id);
            setBq(bq);
        }
        if (!deskItem) {
            const deskItem = deskItems.find(item => item.id == message?.specialChatItem?.id);
            setDeskItem(deskItem);

        }


    }, [burningQuestions, deskItems])



    const isCurrentUser = () => {
        return message.uid == auth.currentUser.uid;
    }

    const isContinuationAbove = () => {
        const previous = new Date(previousMessage?.createdAt);
        //if the previous message was sent 5 minutes ago AND it was sent by the same user 
        //then the above message is a contiuation to this message

        return previousMessage && previousMessage.uid === message.uid &&
            messageDate - previous < 5 * 60 * 1000;
    }

    const isContinuationBelow = () => {
        const next = new Date(nextMessage?.createdAt);

        //if the  message after this one was sent 5 minutes ago AND it was sent by the same user 
        //then the below message is a contiuation to this message

        return nextMessage && nextMessage.uid === message.uid &&
            next - messageDate < 5 * 60 * 1000;

    }

    if (message.isSystem) {
        return (
            <LightText darkgray style={{ textAlign: 'center' }}>{message.text}</LightText>
        )
    }

    return (
        <View>
            <TouchableOpacity
                activeOpacity={1}
                disabled={disabled}
                style={{
                    marginBottom: !isContinuationBelow() || message.pinned ? 20 : 0,
                    marginTop: message.pinned && 20,
                    ...style
                }}
                onPress={() => doubleTap(500, lastTap, setLastTap, onLikePress)}
                onLongPress={onLongPress}
                delayLongPress={300}>

                {!isContinuationAbove() && <View style={styles.topMessageContainer}>
                    <View style={{ flexDirection: 'row' }}>



                        {!isContinuationAbove() &&
                            <RegularText primary={!isCurrentUser()} accent={isCurrentUser()} h5 >
                                {getDisplayNameOrYou(message.user)}
                            </RegularText>
                        }
                    </View>

                    {!isContinuationAbove() && (showTimestamp || useCase == 'reply') &&
                        <RegularText darkgray style={{ fontSize: 12 }}>
                            {Date.now() - messageDate < 1000 * 60 * 60 * 12 ?
                                moment(messageDate).format('LT') :
                                moment(messageDate).calendar()
                            }
                        </RegularText>
                    }
                </View>}
                <View style={styles.mainContainer}>

                    <View style={{
                        height: '100%',
                        width: 3,
                        backgroundColor: isCurrentUser() ? Colors.accent : Colors.primary,
                        zIndex: 1,
                        borderTopLeftRadius: !isContinuationAbove() || message.pinned ? 8 : 0,
                        borderBottomLeftRadius: !isContinuationBelow() || message.pinned ? 8 : 0
                    }} />


                    <View style={{
                        width: '100%',
                        backgroundColor: message.pinned ? Colors[colorScheme].lightGray : 'transparent',
                        padding: 4,
                        borderBottomRightRadius: !isContinuationBelow() || message.pinned ? 8 : 0,
                        borderTopRightRadius: !isContinuationAbove() || message.pinned ? 8 : 0,
                    }}>

                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>


                            <View style={{ width: '100%' }}>

                                {
                                    message.contentType === "desk item" && deskItem &&
                                    <DeskItemThumbnail
                                        disabled={disabled}
                                        user={specialChatItemUser}
                                        deskItem={deskItem}


                                    />


                                }

                                {
                                    message?.replyToMessage && useCase != 'reply' &&
                                    <View style={{ padding: 10, borderWidth: 1, width: '90%', borderColor: Colors[colorScheme].gray, borderRadius: 15, marginBottom: 10 }}>
                                        <ChatMessage
                                            disabled
                                            messages={messages}
                                            message={messages.find(item => item.id == message?.replyToMessage.id)}
                                            useCase={'reply'}
                                            style={{ marginBottom: 0 }}

                                        />
                                    </View>


                                }

                                {
                                    message.contentType === "photo" &&
                                    <TouchableWithoutFeedback
                                        disabled={disabled}
                                        onPress={() => navigation.navigate('FullScreenMedia', { media: message.media })}>


                                        <View style={{ width: 150, height: 200, borderRadius: 5, overflow: 'hidden' }}>
                                            <CustomImage source={{ uri: message.media }} style={{ width: '100%', height: '100%' }} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                }
                                {
                                    message.contentType === "gif" &&
                                    <TouchableWithoutFeedback
                                        disabled={disabled}
                                        onPress={() => navigation.navigate('FullScreenMedia', { media: message.media })}>


                                        <View style={{ width: 240, height: 150, borderRadius: 20, overflow: 'hidden' }}>
                                            <CustomImage source={{ uri: message.media }} style={{ width: '100%', height: '100%' }} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                }
                                {message.contentType === "burning question" && bq &&



                                    <TouchableWithoutFeedback
                                        onPress={() => navigation.navigate('BurningQuestion', { id: message.specialChatItem.id })}>

                                        <BurningQuestion
                                            width={250}
                                            useCase={useCase}
                                            disabled={disabled}
                                            onLongPress={onLongPress}
                                            bq={bq}
                                            user={specialChatItemUser}
                                        />

                                    </TouchableWithoutFeedback>}
                                {message.contentType === "bq answer" &&



                                    <TouchableWithoutFeedback
                                        onPress={() => navigation.navigate('BurningQuestion', { id: message.specialChatItem.id })}>

                                        <BQAnswer
                                            disabled={disabled}
                                            width={300}
                                            useCase={useCase}
                                            onLongPress={onLongPress}
                                            answer={message.specialChatItem}
                                            user={specialChatItemUser}

                                        />

                                    </TouchableWithoutFeedback>}

                                <View style={{ width: '90%' }}>


                                    {message.text &&
                                        <RegularText h5>{message.text}</RegularText>
                                    }
                                </View>
                            </View>



                            <View style={{ right: 5, position: 'absolute', flexDirection: 'row' }}>



                                {message.pinned &&
                                    <TouchableOpacity
                                        style={{ marginRight: 10 }}

                                        disabled={disabled}
                                        onPress={onPinPress}>
                                        <CustomImage source={assets.tack} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].darkGray }} />

                                    </TouchableOpacity>}
                                {!disabled &&

                                    <ScaleButton
                                        style={{ flexDirection: 'row' }}
                                        onPress={onLikePress}>
                                        <CustomImage source={message.likes.length ? assets.heart : assets.heart_o} style={{ width: 15, height: 15, tintColor: !message.likes.includes(auth.currentUser.uid) ? Colors[colorScheme].darkGray : Colors.red }} />
                                        {message.likes.length > 0 && <LightText p style={[styles.likesCount, { color: Colors[colorScheme].darkGray }]}>{message.likes.length}</LightText>}

                                    </ScaleButton>}

                            </View>
                        </View>
                    </View>
                </View>



            </TouchableOpacity>
        </View>




    )
}


const styles = StyleSheet.create({


    likesCount: {
        position: 'absolute',
        right: -5,
        bottom: -5,
        marginLeft: 5,
        fontSize: 10
    },

    middleContainer: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },


    mainContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    topMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'space-between'


    }
})
export default ChatMessage