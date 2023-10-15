import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useColorScheme from '../hooks/useColorScheme';
import { Colors, assets } from '../constants';
import { SHADOWS } from '../constants/Theme';
import ProfileButton from './ProfileButton';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { RegularText } from './StyledText';
import { useNavigation } from '@react-navigation/native';
import { likeBQAnswer, unlikeBQAnswer } from '../services/burningQuestions';
import { useSelector } from 'react-redux';
import { auth } from '../Firebase/firebase';
import { getDisplayNameOrYou, haptics } from '../utils';
import { addNotification } from '../services/notifications';
import CustomImage from './CustomImage';


const BQAnswer = ({ useCase, onLongPress, onMorePress, user, answer, colors, style, containerStyle, ...props }) => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [currentLikeState, setCurrentLikeState] = useState({
        state: answer?.likes?.includes(auth.currentUser.uid),
        count: answer?.likes?.length || 0
    });




    const onLikePress = () => {
        haptics('light');
        //if already liked then unlike the bq answer
        if (currentLikeState.state == true) {
            setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
            unlikeBQAnswer(answer.bq.id, answer.id)

                .catch((e) => {
                    props.onTaskError(e.message);
                    setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
                });

        }
        //if not already liked, like the bq answer
        else {
            setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
            likeBQAnswer(answer.bq.id, answer.id)
                .then(() => {
                    if (currentUser.uid != answer.uid)

                        addNotification(
                            answer.uid,
                            currentUser.uid,
                            currentUser.displayName,
                            'liked your Burning Question reply',
                            'burning question reply like',
                            { name: 'BurningQuestion', params: { id: answer.bq.id } })

                })

                .catch((e) => {

                    props.onTaskError(e.message);
                    setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
                });
        }
    }
    const onSharePress = () => {
        navigation.navigate('Share', {
            message: {
                text: null,
                contentType: 'bq answer',
                specialChatItem: answer,
                media: null
            },


        })
    }
    const BottomActionBar = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '50%' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                    <TouchableOpacity
                        onPress={onLikePress}
                        activeOpacity={0.7}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CustomImage
                            source={currentLikeState.state ? assets.heart : assets.heart_o}
                            style={{ width: 20, height: 20, tintColor: currentLikeState.state ? Colors.red : Colors[colorScheme].darkGray }} />
                        {currentLikeState.count > 0 && <RegularText verydarkgray style={{ marginLeft: 5 }}>{currentLikeState.count}</RegularText>}

                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={onSharePress}
                    activeOpacity={0.7}>
                    <CustomImage
                        source={assets.send_o}
                        style={{ width: 20, height: 20, tintColor: Colors[colorScheme].darkGray, transform: [{ rotate: '45deg' }] }} />

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onMorePress(answer)}
                    activeOpacity={0.7}>
                    <CustomImage
                        source={assets.more}
                        style={{ width: 20, height: 20, tintColor: Colors[colorScheme].darkGray }} />

                </TouchableOpacity>
            </View >
        )
    }
    if (!answer) {
        return <></>
    }
    if (useCase == 'share') {
        return (
            <View style={{ ...SHADOWS[colorScheme], shadowColor: '#00000040', ...style }}>
                <LinearGradient
                    colors={answer?.isBest ? ['#F84400', '#F98E0A', '#F9D013'] : ['transparent', 'transparent']}

                    style={{ borderRadius: 15, padding: 3, alignItems: 'center', justifyContent: 'center', width: 148, height: 123 }}
                >
                    <View style={{ backgroundColor: Colors[colorScheme].invertedTint, padding: 20, borderRadius: 15, width: 145, height: 120, ...containerStyle }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <RegularText darkgray>{moment(new Date(answer.createdAt)).format('MMM DD, YYYY')}</RegularText>
                        </View>

                        <RegularText numberOfLines={2} p style={{ marginTop: 10 }}>{answer.text}</RegularText>

                    </View>
                </LinearGradient>
            </View>

        )

    }

    return (
        <TouchableWithoutFeedback
            onLongPress={onLongPress}
            onPress={() => navigation.navigate('BurningQuestion', { id: answer.bq.id })}>


            <View style={{ ...SHADOWS[colorScheme], shadowColor: '#00000040', ...style }}>
                <LinearGradient
                    colors={answer?.isBest == true ? ['#F84400', '#F98E0A', '#F9D013'] : ['transparent', 'transparent']}

                    style={{ borderRadius: 15, padding: 3, alignItems: 'center', justifyContent: 'center', width: props.width }}
                >
                    <View style={{ backgroundColor: Colors[colorScheme].invertedTint, padding: 20, borderRadius: 15, width: props.width || '100%', ...containerStyle }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>


                            <ProfileButton
                                size={30}
                                imageURL={answer.isAnonymous == true ? null : user?.photoURL}
                                showsName
                                defaultImage={answer.isAnonymous && assets.person_gradient.uri}
                                name={!answer?.isAnonymous ? getDisplayNameOrYou(user) : 'Someone'}
                            />

                            <RegularText darkgray>{moment(answer.createdAt).format('MMM DD, YYYY')}</RegularText>
                        </View>

                        <RegularText numberOfLines={useCase == 'chat' ? 3 : null} p style={{ marginTop: 10 }}>{answer.text}</RegularText>


                        {useCase != 'chat' && useCase != 'profile' &&
                            <BottomActionBar />}
                    </View>


                </LinearGradient>

            </View>
        </TouchableWithoutFeedback>
    )





}

export default BQAnswer