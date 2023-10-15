import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import useColorScheme from '../hooks/useColorScheme'
import { SHADOWS } from '../constants/Theme'
import DeskItemPreview from './DeskItemThumbnail'
import { assets, Colors } from '../constants'
import ProfileButton from './ProfileButton'
import { BoldText, LightText, MediumText, RegularText } from './StyledText'
import { doubleTap, getDateString, getDefaultImage, getDisplayNameOrYou } from '../utils'
import firebase from 'firebase/compat'
import { auth, db } from '../Firebase/firebase'
import ScaleButton from './ScaleButton'
import CustomText from './CustomText'
import { ActivityIndicator } from 'react-native-paper'
import { getLikeById, updateLike } from '../services/post'
import CustomImage from './CustomImage'
import { useNavigation } from '@react-navigation/native'
const Post = (props) => {
    const colorScheme = useColorScheme()
    const {
        post,
        isComment,
        user,
        onReplyPress,
        onMorePress,
        onLikePress,
        onCommentPress,
        chatroom
    } = props
    const [lastTap, setLastTap] = useState(null)
    const navigation = useNavigation()
    const [currentLikeState, setCurrentLikeState] = useState({ state: false, count: post.likeCount })
    useEffect(() => {
        getLikeById(post.id, auth.currentUser.uid).then((res) => {
            setCurrentLikeState({
                ...currentLikeState,
                state: res,
                count: post.likeCount

            })
        })


    }, [])

    const handleUpdateLike = () => {
        setCurrentLikeState({
            state: !currentLikeState.state,
            count: currentLikeState.count + (currentLikeState.state ? -1 : 1)
        })
        onLikePress(currentLikeState.state ? -1 : 1)
    }



    const styles = StyleSheet.create({
        postIcon: {
            width: 23,
            height: 23,
            tintColor: Colors[colorScheme].darkGray,
            marginLeft: 15
        },

        profileButtonContainer: {
            height: '50%'
        }
    })


    const isVotedByUser = () => {
        return post?.votes?.includes(auth.currentUser.uid)
    }

    const hasVotes = () => {
        return currentLikeState.count > 0
    }
    if (!user || !post) {
        return (<View></View>)
    }
    return (
        <TouchableWithoutFeedback onPress={() => doubleTap(500, lastTap, setLastTap, props.onLikePress)}>


            <View style={{ backgroundColor: Colors[colorScheme].invertedTint, padding: 15, marginBottom: 20, borderRadius: 15, ...SHADOWS[colorScheme], shadowRadius: 12 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>



                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.profileButtonContainer}>
                            <ProfileButton
                                size={32}
                                imageURL={user.photoURL}
                                onPress={() => navigation.navigate('Profile', { uid: user.photoURL })}

                            />

                        </View>

                        <View style={{ marginLeft: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                <RegularText h5 tint>{getDisplayNameOrYou(user)}</RegularText>

                                {post.createdAt &&
                                    <LightText darkgray>
                                        {" • " + getDateString(post.createdAt.toDate())}
                                    </LightText>}
                            </View>
                            {!isComment ?

                                <View style={{ flexDirection: 'row' }}>
                                    <ProfileButton
                                        size={25}
                                        defaultImage={getDefaultImage(props.chatroom.type)}
                                        onPress={() => navigation.navigate('ChatroomProfile', { id: post.chatroomId })}
                                        buttonStyle={{ borderRadius: 8 }}
                                        imageContainerStyle={{ borderRadius: 8 }}
                                    />

                                    <RegularText p darkgray style={{ marginLeft: 5 }}>{props.chatroom.name}</RegularText>

                                </View>
                                :
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', { uid: user.uid })}>
                                    <View>
                                        <RegularText darkgray>{'@' + user.username}</RegularText>

                                    </View>
                                </TouchableWithoutFeedback>
                            }
                        </View>

                    </View>
                </View>


                <LightText h5 tint style={{ marginVertical: 15 }} >
                    <CustomText includesSymbol symbol={'@'} text={post.text} />
                </LightText>


                {post?.media?.length > 0 &&

                    <View style={{ width: '100%', height: 350, borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
                        <CustomImage source={{ uri: post.media[0] }} style={{ width: '100%', height: '100%' }} />
                    </View>}
                {post.type == 'desk post' && <DeskItemPreview post={post.post} />}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                        <TouchableWithoutFeedback

                            toValue={1.8}
                            duration={150}
                            animationEnabled
                            onPress={() => handleUpdateLike(currentLikeState)}
                            onLongPress={() => { }}>
                            <CustomImage
                                tintColor={!currentLikeState.state ? Colors[colorScheme].darkGray : Colors.accent}
                                source={assets.left_arrow}
                                style={[styles.postIcon, { marginLeft: 0, transform: [{ rotateZ: '90deg' }] }]}
                            />
                        </TouchableWithoutFeedback>




                        <BoldText style={{ marginLeft: 5, color: currentLikeState.state ? Colors.accent : Colors[colorScheme].darkGray }}>
                            {currentLikeState.count}
                        </BoldText>



                        {!isComment ?

                            <TouchableOpacity
                                style={{ flexDirection: 'row' }}
                                activeOpacity={0.5}
                                onPress={onCommentPress}
                            >

                                <CustomImage
                                    source={assets.chat_bubble_o}
                                    style={styles.postIcon} />


                                {post?.comments > 0 &&

                                    <RegularText darkgray style={{ marginLeft: 5 }}>
                                        {post.comments == 1 ? post.comments + " comment" : post.comments + " comments"}

                                    </RegularText>

                                }
                            </TouchableOpacity>
                            :

                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={onReplyPress}>

                                <CustomImage
                                    tintColor={Colors.light.darkGray}
                                    source={assets.reply}
                                    style={[styles.postIcon, { width: 26, height: 26 }]} />
                            </TouchableOpacity>

                        }

                    </View>
                    <TouchableOpacity onPress={onMorePress}>

                        <CustomImage
                            source={assets.more}
                            style={styles.postIcon} />

                    </TouchableOpacity>

                </View>
                <View >

                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
export default Post