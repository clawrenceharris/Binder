import { View, Text, Dimensions, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { MediumText } from '../components/StyledText'
import Header from '../components/Header';
import { Colors, assets } from '../constants';
import useColorScheme from '../hooks/useColorScheme';
import FlashcardInput from '../components/FlashcardInput';
import SlideModal from '../components/SlideModal';
import OptionsList from '../components/OptionsList';
import DeskItemEditPreview from '../components/DeskItemEditPreview';
import { openMediaLibrary } from '../utils';
import CustomImage from '../components/CustomImage';
const MAX_QUESTIONS = 20;


const EditGame = (props) => {
    const { useCase, deskItem } = props.route.params;
    const [questions, setQuestions] = useState(deskItem?.questions || []);

    const colorScheme = useColorScheme();
    const [question, setQuestion] = useState('');
    const [question2, setQuestion2] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');
    const [answer4, setAnswer4] = useState('');
    const [isQuestionImage, setIsQuestionImage] = useState(false);
    const [isAnswer1Image, setIsAnswer1Image] = useState(false);
    const [isAnswer2Image, setIsAnswer2Image] = useState(false);
    const [isAnswer3Image, setIsAnswer3Image] = useState(false);
    const [isAnswer4Image, setIsAnswer4Image] = useState(false);

    const [correctAnswer, setCorrectAnswer] = useState('');
    const answers = [answer1, answer2, answer3, answer4];
    const answersScrollRef = useRef(null);
    const questionsScrollRef = useRef(null)
    const [showImageOptionsModal, setShowImageOptionsModal] = useState({ show: false });
    const { height, width } = Dimensions.get('window');
    const [questionImage, setQuestionImage] = useState('');

    const onTakePicturePress = (callback) => {

        setShowImageOptionsModal({ show: false });
        props.navigation.navigate('Camera', {
            useCase: 'single photo to use',
            canRecord: false,
            callback
        });
    }

    const deleteQuestion = (question) => {
        setQuestions(questions.filter(item => item != question))
    }


    const onAddQuestionPress = () => {
        setQuestions([...questions, {
            question: isQuestionImage ? question2 : question,
            image: question,
            answerChoices: [
                { data: answer1, isImage: isAnswer1Image },
                { data: answer2, isImage: isAnswer2Image },
                { data: answer3, isImage: isAnswer3Image },
                { data: answer4, isImage: isAnswer4Image },],
            correctAnswer

        }]);
        setQuestion('');
        setCorrectAnswer('');
        setAnswer1('');
        setAnswer2('');
        setAnswer3('');
        setAnswer4('');
        setQuestion2('');
        answersScrollRef.current?.scrollTo({ index: 0, animate: true })
    }

    const canContinue = () => {
        return answers.filter(item => item).length >= 2 &&
            question && questions.length < MAX_QUESTIONS &&
            correctAnswer;
    }
    return (
        <View style={{ backgroundColor: Colors[colorScheme].background, flex: 1 }}>
            <Header

                title={useCase == "edit desk item" ? "Edit Game" : "New Game"}
                headerRight={
                    <MediumText
                        h4
                        disabled={questions.length == 0}
                        onPress={() => props.navigation.navigate('EditDeskItemB', { questions, type: "Game", useCase, deskItem })}
                        accent={questions.length > 0}
                        darkgray={questions.length == 0}>
                        {"Next"}
                    </MediumText>
                }
            />

            <SlideModal
                onCancel={() => setShowImageOptionsModal({ show: false })}
                showModal={showImageOptionsModal.show}
                height={height - (3 * 50) - 10}

            >
                <OptionsList

                    options={['Take Photo', 'Upload Photo']}
                    onOptionPress={[() => onTakePicturePress(showImageOptionsModal.callback), () => openMediaLibrary(showImageOptionsModal.callback)]}
                    onCancel={() => setShowImageOptionsModal({ show: false })}
                />
            </SlideModal>
            <View style={{ paddingHorizontal: 15 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <MediumText verydarkgray h4 style={[styles.sectionHeaderText, { marginTop: 0, marginBottom: 0 }]}>
                        {"Questions (" + questions.length + "/" + MAX_QUESTIONS + ")"}
                    </MediumText>
                    <MediumText
                        h4
                        accent={canContinue()}
                        darkgray={!canContinue()}
                        onPress={onAddQuestionPress}
                        disabled={!canContinue()}>
                        {"Add"}
                    </MediumText>
                </View>

                <View style={{ flexDirection: 'row' }}>




                    <FlashcardInput
                        style={{ width: '100%' }}
                        isQuestion
                        type={"Game"}
                        onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setQuestion })}
                        value={question}
                        onChangeImage={setIsQuestionImage}
                        isImage={isQuestionImage}
                        placeholder={'Question'}
                        onChangeText={setQuestion}
                    />

                    {isQuestionImage &&

                        <FlashcardInput
                            style={{ flex: 1 }}
                            isQuestion
                            type={"Game"}
                            imageDisabled
                            value={question2}
                            placeholder={'Question'}
                            onChangeText={setQuestion2}
                        />}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <TouchableOpacity onPress={() => answersScrollRef.current?.scrollTo({ index: 0, animate: true })}>
                        <CustomImage source={assets.left_arrow} style={{ width: 18, height: 18, tintColor: Colors[colorScheme].veryDarkGray }} />
                    </TouchableOpacity>
                    <ScrollView
                        ref={answersScrollRef}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled

                        style={{ marginTop: 20 }}>


                        <FlashcardInput
                            type={"Game"}
                            containerStyle={{ marginHorizontal: 5 }}
                            style={{ width: (width / 2) - 15 - 15 - 15 }}
                            onChangeImage={setIsAnswer1Image}
                            isImage={isAnswer1Image}
                            onCorrectPress={setCorrectAnswer}
                            isCorrect={answer1 && correctAnswer == answer1}
                            onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setAnswer1 })}
                            placeholder={'Answer choice 1'}
                            value={answer1}
                            onChangeText={setAnswer1}
                        />

                        <FlashcardInput
                            type={"Game"}
                            containerStyle={{ marginHorizontal: 5 }}
                            style={{ width: (width / 2) - 15 - 15 - 15 }}
                            onCorrectPress={setCorrectAnswer}
                            onChangeImage={setIsAnswer2Image}
                            isImage={isAnswer2Image}
                            isCorrect={answer2 && correctAnswer == answer2}
                            onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setAnswer2 })}
                            placeholder={'Answer choice 2'}
                            value={answer2}
                            onChangeText={setAnswer2}
                        />

                        <FlashcardInput
                            type={"Game"}
                            style={{ width: (width / 2) - 15 - 15 - 15 }}
                            onChangeImage={setIsAnswer3Image}
                            isImage={isAnswer3Image}
                            containerStyle={{ marginHorizontal: 5 }}
                            onCorrectPress={setCorrectAnswer}
                            isCorrect={answer3 && correctAnswer == answer3}
                            onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setAnswer3 })}
                            placeholder={'Answer choice 3'}
                            value={answer3}
                            onChangeText={setAnswer3}
                        />
                        <FlashcardInput
                            type={"Game"}
                            containerStyle={{ marginHorizontal: 5 }}
                            style={{ width: (width / 2) - 15 - 15 - 15 }}
                            onChangeImage={setIsAnswer4Image}
                            isImage={isAnswer4Image}
                            onCorrectPress={setCorrectAnswer}
                            isCorrect={answer4 && correctAnswer == answer4}
                            onAddImagePress={() => setShowImageOptionsModal({ show: true, callback: setAnswer4 })}
                            placeholder={'Answer choice 4'}
                            value={answer4}
                            onChangeText={setAnswer4}
                        />

                    </ScrollView>

                    <TouchableOpacity onPress={answersScrollRef.current?.scrollToEnd}>
                        <CustomImage source={assets.right_arrow} style={{ width: 18, height: 18, tintColor: Colors[colorScheme].veryDarkGray }} />
                    </TouchableOpacity>

                </View>


                <View style={{ height: 200 }}>


                    <ScrollView
                        ref={questionsScrollRef}
                        scrollEnabled={true}

                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled
                        onContentSizeChange={questionsScrollRef.current?.scrollToEnd}
                        style={{ marginTop: 20 }}>
                        {questions.map((item, index) =>
                            <DeskItemEditPreview
                                type={"Game"}
                                item={item}
                                containerStyle={{ marginHorizontal: 5 }}
                                style={{ width: (width / 2) - 15 - 10 }}
                                onRemovePress={() => deleteQuestion(item)}
                                key={index.toString()}
                            />
                        )}
                    </ScrollView>
                </View>





            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    sectionHeaderText: {

        marginTop: 30,
        marginBottom: 10,

    }
})
export default EditGame