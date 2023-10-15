import { Dimensions, FlatList, Keyboard, KeyboardAvoidingView, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { auth, db } from '../Firebase/firebase'
import Header from '../components/Header'
import useColorScheme from '../hooks/useColorScheme'
import { Colors, assets } from '../constants'
import BurningQuestionComponent from '../components/BurningQuestion'
import MoreButton from '../components/MoreButton'
import SlideModal from '../components/SlideModal'
import OptionsList from '../components/OptionsList'
import SendButton from '../components/SendButton'
import { addBQAnswer, deleteBQAnswer, deleteBurningQuestion, markBQAnswerAsBest, unmarkBQAnswerAsBest } from '../services/burningQuestions'
import { useBQAnswers } from '../hooks/useBQAnswers'
import StyledTextInput from '../components/StyledTextInput'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { ProfileButton } from '../components'
import { getDefaultImage, getItemLayout } from '../utils'
import BQAnswer from '../components/BQAnswer'
import { addNotification } from '../services/notifications'
import { useBurningQuestions } from '../hooks/useBurningQuestions'
import { MediumText, RegularText } from '../components/StyledText'
const BurningQuestion = (props) => {
    const [bq, setBq] = useState(props.route.params?.bq)
    const { useCase } = props.route.params;
    const [showModal, setShowModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const colorScheme = useColorScheme();
    const { height, width } = Dimensions.get('window');
    const users = useSelector(state => state.usersState.users);
    const { burningQuestions } = useBurningQuestions();
    const { answers } = useBQAnswers(bq?.id || props.route.params.id);
    const insets = useSafeAreaInsets();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const inputRef = useRef();

    const isCurrentUser = () => {
        return bq?.uid == auth.currentUser.uid;
    }
    useEffect(() => {
        if (!bq) {
            const bq = burningQuestions.find(item => item.id == props.route.params.id);
            setBq(bq);
        }


    }, [burningQuestions])


    const onDeleteAnswePress = () => {
        setShowAnswerModal(false);
        props.onTaskStart('Deleting...');
        deleteBQAnswer(bq.id, selectedAnswer?.id)
            .then(() => props.onTaskComplete('Deleted.'))
            .catch((e) => props.onTaskError(e.message))
    }
    const onDeleteQuestionPress = () => {
        setShowModal(false);
        props.onTaskStart('Deleting...');
        deleteBurningQuestion(bq.id)
            .then(() => {
                props.navigation.goBack();
                props.onTaskComplete('Deleted.');
            })
            .catch((e) => props.onTaskError(e.message));
    }
    const onReportPress = () => {
        setShowModal(false);
        setShowAnswerModal(false);
        props.navigation.navigate('SendReport', {
            data: {
                type: 'burning question',
                id: bq.id
            },
            title: 'Report',
            useCase: 'report'
        })
    }
    const onSharePress = () => {
        setShowModal(false);
        props.navigation.navigate('Share', {
            message: {
                text: null,
                contentType: 'burning question',
                specialChatItem: bq,
                media: null
            },


        })
    }

    const onEditPress = () => {
        setShowModal(false);
        props.navigation.navigate('NewBurningQuestion', { bq, onSubmit: (data) => setBq({ ...bq, ...data }) });

    }
    const onAnswerPress = () => {
        Keyboard.dismiss();
        setLoading(true);

        addBQAnswer(bq, answer)
            .then(() => {
                setAnswer('');
                if (!isCurrentUser())
                    addNotification(
                        bq.uid,
                        currentUser.uid,
                        currentUser.displayName,
                        'answered to your Burning Question',
                        'burning question answer'
                    );
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                props.onTaskError(e.message);

            })

    }
    const RenderItem = ({ item }) => {
        return (
            <BQAnswer
                style={{ margin: 15 }}
                answer={item}
                onTaskError={props.onTaskError}
                user={users.find(user => user.uid == item?.uid)}
                onMorePress={(answer) => {
                    setShowAnswerModal(true);
                    setSelectedAnswer(answer);
                }}
                colors={['transparent', 'transparent']} />
        )
    }
    const onMarkPress = () => {
        setShowAnswerModal(false);
        if (selectedAnswer?.isBest)
            unmarkBQAnswerAsBest(bq.id)
                .catch((e) => props.onTaksError(e, message))

        else
            markBQAnswerAsBest(bq.id, selectedAnswer?.id)
                .catch((e) => props.onTaskError(e.message))
    }
    if (bq) {
        const bestAnswer = answers.find(item => item?.isBest);
        return (
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

                <Header
                    title='Burning Question'
                    headerRight={<MoreButton onPress={() => setShowModal(true)} />}
                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={"height"}>

                    <SlideModal
                        height={isCurrentUser() ? height - (4 * 50) - 10 : height - (3 * 50) - 10}
                        showModal={showModal}
                        onCancel={() => setShowModal(false)}>
                        <OptionsList
                            showsIcons={false}
                            onCancel={() => setShowModal(false)}
                            options={isCurrentUser() ? [
                                'Edit',
                                {
                                    title: 'Share',
                                    rightComponent: <SendButton onPress={onSharePress} />
                                },
                                'Delete'] :
                                [
                                    {
                                        title: 'Share',
                                        rightComponent: <SendButton onPress={onSharePress} />
                                    },
                                    'Report']}
                            onOptionPress={isCurrentUser() ?
                                [onEditPress, onSharePress, onDeleteQuestionPress] :
                                [onSharePress, onReportPress]} />
                    </SlideModal>
                    <SlideModal
                        height={!isCurrentUser() ? height - (2 * 50) - 10 : height - (3 * 50) - 10}
                        showModal={showAnswerModal}
                        onCancel={() => setShowAnswerModal(false)}>
                        <OptionsList
                            showsIcons={false}
                            onCancel={() => setShowAnswerModal(false)}
                            options={selectedAnswer?.uid == currentUser.uid ? [isCurrentUser() && selectedAnswer?.isBest ? 'Unmark As Best Answer' : 'Mark as Best Answer', 'Delete'] : ['Report']}
                            onOptionPress={selectedAnswer?.uid == currentUser.uid ? [isCurrentUser() && onMarkPress, onDeleteAnswePress] : [onReportPress]}
                        />
                    </SlideModal>


                    {bq &&
                        <BurningQuestionComponent
                            bq={bq}
                            user={users.find(item => item.uid == bq.uid)}
                            style={{ margin: 15 }}
                            onAnswerPress={inputRef.current?.focus}
                            containerStyle={{ width: '100%' }}

                        />}
                    {bq.tags.length > 0 &&
                        <View>


                            <FlatList
                                scrollEnabled={false}
                                data={bq.tags}
                                keyExtractor={item => item}
                                showsHorizontalScrollIndicator={false}
                                getItemLayout={getItemLayout}
                                numColumns={3}
                                renderItem={({ item }) =>
                                    <View style={{ justifyContent: 'center', borderWidth: 1, borderColor: Colors.orange, maxWidth: 120, marginLeft: 15, marginRight: 5, marginTop: 10, backgroundColor: Colors[colorScheme].invertedTint, paddingHorizontal: 20, padding: 4, borderRadius: 25, flexDirection: 'row', alignItems: 'center' }}>
                                        <RegularText numberOfLines={1} style={{ color: Colors.orange }}>{item}</RegularText>


                                    </View>

                                }
                            />
                        </View>}
                    <View style={{ marginTop: 15, width, height: 1, backgroundColor: Colors[colorScheme].gray }} />

                    <FlatList
                        ListHeaderComponent={<View>


                            {bestAnswer && <MediumText verydarkgray h4 style={{ marginHorizontal: 15, marginTop: 30 }}>Best Answer:</MediumText>}

                            <RenderItem item={bestAnswer} />
                            {answers.filter(item => !item?.isBest).length > 0 && <MediumText verydarkgray h4 style={{ marginHorizontal: 15, marginTop: 30 }}>Answers:</MediumText>}

                        </View>}
                        data={answers.filter(item => !item?.isBest)}
                        keyExtractor={item => item.id}

                        renderItem={({ item }) => <RenderItem item={item} />}
                    />
                    <View style={{ borderTopWidth: 1, borderColor: Colors[colorScheme].gray, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', paddingBottom: insets.bottom, paddingTop: 10 }}>


                        <StyledTextInput
                            inputRef={inputRef}
                            containerStyle={{ flex: 1 }}
                            autoFocus={useCase == 'answer'}
                            placeholder='Type your answer...'
                            multiline
                            style={{ maxHeight: 200, paddingLeft: 40 }}
                            icon={

                                <ProfileButton
                                    size={35}
                                    defaultImage={getDefaultImage('private')}
                                    imageURL={currentUser.photoURL}
                                />
                            }
                            value={answer}
                            onChangeText={setAnswer}


                        />
                        <SendButton
                            style={{ marginLeft: 10 }}
                            loading={loading}
                            size={35}
                            disabled={!answer}
                            onPress={onAnswerPress} />
                    </View>
                </KeyboardAvoidingView>

            </View>
        )
    }
}

export default BurningQuestion