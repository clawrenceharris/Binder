import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, useWindowDimensions, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import OptionsList from './OptionsList'
import { auth, db } from '../Firebase/firebase'
import { getDisplayNameOrYou } from '../utils'
import { Colors } from '../constants'
import moment from 'moment'
import useColorScheme from '../hooks/useColorScheme'
import SlideModal from './SlideModal'
import { LightText, MediumText, RegularText } from './StyledText'
const ChatModal = ({ message, visible, onCancel, onReplyPress, onReportPress, onDeletePress, onPinPress }) => {

    const { height } = Dimensions.get('window')

    const isCurrentUser = () => {
        return message?.uid === auth.currentUser.uid;
    }

    return (


        <SlideModal
            height={!isCurrentUser() ? (height - (6.8 * 50) - 10) : (height - (5.8 * 50) - 10)}
            showModal={visible}
            onCancel={onCancel}>

            <OptionsList
                ListHeaderComponent={

                    <View>
                        <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <RegularText h5 accent={auth.currentUser.uid == message?.uid} primary={auth.currentUser.uid != message?.uid}>
                                {getDisplayNameOrYou(message?.user)}
                            </RegularText>

                            <LightText darkgray>{moment(message?.createdAt).calendar()}</LightText>

                        </View>

                        {message?.contentType == 'text' &&
                            <RegularText numberOfLines={1} h5>{message.text}</RegularText>
                        }
                        {message?.contentType == 'photo' &&
                            <LightText h5 darkgray>{"photo"}</LightText>
                        }
                        {message?.contentType == 'burning question' &&
                            <LightText h5 darkgray>{"Burning Question"}</LightText>
                        }
                        {message?.contentType == 'bq answer' &&
                            <LightText h5 darkgray>{'Burning Question answer'}</LightText>
                        }

                        {message?.contentType == 'doc' &&
                            <LightText h5 darkgray>{'file'}</LightText>
                        }

                        {message?.contentType == 'desk item' &&
                            <LightText h5 darkgray>{message.specialChatItem.type}</LightText>
                        }


                    </View>
                }
                onCancel={onCancel}
                options={
                    isCurrentUser() ?
                        [message?.pinned ? 'Unpin' : 'Pin', 'Reply', 'Delete'] :
                        [message?.pinned ? 'Unpin' : 'Pin', 'Reply', 'Report']}

                onOptionPress={
                    isCurrentUser() ?
                        [onPinPress, onReplyPress, onDeletePress] :
                        [onPinPress, onReplyPress, onReportPress]}
                redIndex={message?.uid != auth.currentUser.uid ? 2 : null}

            />


        </SlideModal >




    )
}


const styles = StyleSheet.create({

    cancelOption: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        padding: 10,
        backgroundColor: '#333',
        marginTop: 10,
        borderRadius: 15
    }
})

export default ChatModal