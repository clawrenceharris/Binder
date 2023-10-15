import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useColorScheme from '../hooks/useColorScheme';
import { Colors, assets } from '../constants';
import { SHADOWS } from '../constants/Theme';
import ProfileButton from './ProfileButton';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { MediumText, RegularText } from './StyledText';
import { useNavigation } from '@react-navigation/native';
import { likeBurningQuestion, unlikeBurningQuestion } from '../services/burningQuestions';
import { useSelector } from 'react-redux';
import { auth } from '../Firebase/firebase';
import { getDisplayNameOrYou, haptics } from '../utils';
import { useBQAnswers } from '../hooks/useBQAnswers';
import { addNotification } from '../services/notifications';
import CustomImage from './CustomImage';
import { useUser } from '../hooks/useUser';


const BurningQuestion = ({ useCase, bq, onLongPress, showsBottomActionBar, onAnswerPress, onPress, disabled, style, colors, containerStyle, ...props }) => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const user = props.user || useUser(bq?.uid).data;
    const currentUser = useSelector(state => state.userState.currentUser);
    const [currentLikeState, setCurrentLikeState] = useState({
        state: bq?.likes?.includes(auth.currentUser.uid),
        count: bq?.likes?.length || 0
    });
    const { answers } = useBQAnswers(bq?.id);


    const onLikePress = () => {
        haptics('light');

        if (currentLikeState.state == true) {
            setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
            unlikeBurningQuestion(bq.id)


                .catch((e) => {
                    props.onTaskError(e.message);
                    setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
                });

        }
        else {
            setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
            likeBurningQuestion(bq.id)
                .then(() => {
                    if (currentUser.uid != bq.uid)

                        addNotification(
                            bq.uid,
                            currentUser.uid,
                            currentUser.displayName,
                            'liked your Burning Question',
                            'burning question like',
                            { name: 'BurningQuestion', params: { id: bq.id } })

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
                contentType: 'burning question',
                specialChatItem: bq,
                media: null
            },


        })
    }
    const onBurningQuestionPress = () => {
        if (useCase == 'edit')
            navigation.navigate('NewBurningQuestion', { bq, useCase: 'new', bq, onSubmit: setBq })
        else
            navigation.navigate('BurningQuestion', { bq })

    }
    const BottomActionBar = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '50%' }}>
                <TouchableOpacity
                    onPress={onLikePress}
                    activeOpacity={0.7}
                    disabled={disabled}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>


                    <CustomImage
                        source={currentLikeState.state ? assets.heart : assets.heart_o}
                        style={{ width: 20, height: 20, tintColor: currentLikeState.state ? Colors.red : Colors[colorScheme].darkGray }} />
                    {currentLikeState.count > 0 &&
                        <RegularText
                            verydarkgray
                            disabled={disabled}
                            onPress={() => navigation.navigate('Items', { useCase: 'users', title: 'Likes', items: bq.likes })}
                            style={{ marginLeft: 5 }}>
                            {currentLikeState.count}
                        </RegularText>
                    }

                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('BurningQuestion', { bq, useCase: 'answer' });
                        onAnswerPress && onAnswerPress();
                    }}
                    activeOpacity={0.7}
                    disabled={disabled}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomImage
                        tintColor={Colors[colorScheme].darkGray}
                        source={assets.reply}
                        style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray }} />
                    {answers.length > 0 &&
                        <RegularText
                            disabled={disabled}
                            verydarkgray
                            onPress={() => navigation.push('Items', { useCase: 'bq answers', title: 'Burning Question Answers', items: answers })}>
                            {answers.length}
                        </RegularText>
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={disabled}
                    onPress={onSharePress}
                    activeOpacity={0.7}>
                    <CustomImage
                        source={assets.send_o}
                        style={{ width: 20, height: 20, tintColor: Colors[colorScheme].darkGray, transform: [{ rotate: '45deg' }] }} />

                </TouchableOpacity>
            </View>
        )
    }


    if (!bq) {
        return <></>
    }
    if (useCase == 'share' || useCase == 'edit') {
        return (
            <View style={{ ...SHADOWS[colorScheme], shadowColor: '#00000040', ...style }}>

                <LinearGradient
                    colors={colors || ['#F84400', '#F98E0A', '#F9D013']}

                    style={{ borderRadius: 15, padding: 3, alignItems: 'center', justifyContent: 'center', width: 173, height: 123 }}
                >


                    <View style={{ backgroundColor: Colors[colorScheme].invertedTint, padding: 15, borderRadius: 15, width: 170, height: 120, ...containerStyle }}>
                        <ProfileButton
                            size={30}
                            imageURL={bq.isAnonymous == true ? null : user?.photoURL}
                            showsName
                            defaultImage={bq.isAnonymous && assets.person_gradient.uri}
                            name={!bq.isAnonymous ? getDisplayNameOrYou(user) : 'Someone'}
                        />

                        <MediumText h4 numberOfLines={1} style={{ marginTop: 10 }}>{bq.subject}</MediumText>
                        <RegularText verydarkgray numberOfLines={2} style={{ marginTop: 10 }}>{bq.question}</RegularText>


                    </View>


                </LinearGradient>
            </View>
        )
    }
    return (

        <TouchableWithoutFeedback
            onLongPress={onLongPress}
            disabled={disabled}
            onPress={onPress || onBurningQuestionPress}>

            <View style={{ ...SHADOWS[colorScheme], shadowColor: '#00000040', ...style }}>

                <LinearGradient
                    colors={colors || ['#F84400', '#F98E0A', '#F9D013']}

                    style={{ borderRadius: 15, padding: 3, alignItems: 'center', justifyContent: 'center', width: props.width && props.width + 3 }}
                >


                    <View style={{ backgroundColor: Colors[colorScheme].invertedTint, padding: 10, borderRadius: 15, width: props.width, ...containerStyle }}>
                        {useCase != 'chat' && useCase != 'reply' &&

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>


                                <ProfileButton
                                    size={30}
                                    imageURL={bq.isAnonymous == true ? null : user?.photoURL}
                                    defaultImage={bq.isAnonymous && assets.person_gradient.uri}
                                />

                                <RegularText darkgray>{moment(bq.createdAt).format('MMM DD, YYYY')}</RegularText>
                            </View>}
                        <MediumText h4 style={{ marginTop: 10 }} >{bq.subject}{": "}</MediumText>
                        <RegularText h5 style={{ marginTop: 10 }} numberOfLines={useCase == 'chat' ? 3 : null}>{bq.question}</RegularText>


                        {useCase != 'edit' && showsBottomActionBar && <BottomActionBar />}

                    </View>


                </LinearGradient>

            </View>
        </TouchableWithoutFeedback>

    )


}

export default BurningQuestion