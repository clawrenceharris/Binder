import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Colors, assets } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import CustomImage from '../components/CustomImage'
import { MediumText, RegularText } from '../components/StyledText'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, Layout, SlideInDown, SlideInRight, SlideInUp, SlideOutLeft, SlideOutUp, ZoomIn, ZoomOut, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import Button from '../components/Button'
import { ScrollView } from 'react-native-gesture-handler'
import { SHADOWS } from '../constants/Theme'
import ScaleButton from '../components/ScaleButton'
import { haptics } from '../utils'
import CircularProgressBar from '../components/CircularProgressBar'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#58208B';
const ACCENT_COLOR = '#6CCEFF';


const Game = (props) => {
    const colorScheme = useColorScheme();
    const { game } = props.route.params;
    const { questions } = game;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const colors = [Colors.red, '#EFB234', Colors.green, Colors.accent, Colors.blue];
    const borderColors = ['#E14949', '#DBA22B', '#2AA374', '#4084C3', '#1656A2'];
    const [score, setScore] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [incorrect, setIncorrect] = useState([]);
    const [correct, setCorrect] = useState([]);
    const [showQuestion, setShowQuestion] = useState(true);
    const [showAnswers, setShowAnswers] = useState(true);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [time, setTime] = useState(20);
    const [showScoreAfterBonus, setShowScoreAfterBonus] = useState(false);
    const [timeBonus, setTimeBonus] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [gameOverTitle, setGameOverTitle] = useState('');
    const [gameOverSubtitle, setGameOverSubtitle] = useState('');
    const percentCorrect = Math.round((correct.length / questions.length) * 100);
    const [streak, setStreak] = useState(0);
    const startGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setAnimatedScore(0);
        setIsGameEnded(false);
        setIsPlaying(true);
        setShowQuestion(true);
        setShowAnswers(true);
        setCorrect([]);
        setIncorrect([]);
        setTime(game.time);
        setTimeBonus(0);
        setGameOverTitle('');
        setGameOverSubtitle('');


    }


    useEffect(() => {
        if (isPlaying && time != "untimed") {
            const timer = setTimeout(() => {

                if (time > 0) {

                    setTime(time - 1);

                }
                else {
                    endGame();

                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [time, isPlaying]);


    useEffect(() => {
        if (isCountingDown) {
            const timer = setTimeout(() => {

                if (countdown > 0) {

                    setCountdown(countdown - 1);

                }
                else {
                    startGame();
                    setIsCountingDown(false);
                    setCountdown(3);

                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown, isCountingDown]);


    useEffect(() => {
        if (isGameEnded) {
            setShowScoreAfterBonus(true);


            const timeout = setTimeout(() => {

                if (animatedScore < score + timeBonus) {
                    if (score + timeBonus - animatedScore >= 51)
                        setAnimatedScore(animatedScore + 51);
                    else
                        setAnimatedScore(animatedScore + (score + timeBonus - animatedScore));


                }
                else {
                    setTimeout(() => {
                        setShowScoreAfterBonus(false);

                    }, 1000);

                }
            }, 50);

            return () => clearTimeout(timeout);




        }
    }, [animatedScore, isGameEnded]);


    const endGame = () => {
        const timeBonus = ((time / game.time) * 100) * 50;
        setTimeBonus(timeBonus);
        setGameOverTitle(getMessage()[0]);
        setGameOverSubtitle(getMessage()[1]);

        setTimeout(() => {
            setIsGameEnded(true);
            setIsPlaying(false);
        }, 500);

    }



    const handleAnswer = (selectedAnswer) => {
        haptics('light');
        const correctAnswer = questions[currentIndex].correctAnswer;
        if (correctAnswer == selectedAnswer) {

            setScore(score + 200 + (streak + 1) * 20);

            correct.push(questions[currentIndex]);
        }
        else {
            setStreak(0);
            setScore(score - 5);
            incorrect.push(questions[currentIndex]);
        }
        setTimeout(() => {
            setShowQuestion(false);
            setShowAnswers(false);
        }, 300);
        const nextQuestion = currentIndex + 1;

        if (nextQuestion < questions.length) {

            setTimeout(() => {
                setCurrentIndex(nextQuestion);
                setShowQuestion(true);
                setShowAnswers(true);

            }, 500);
        }
        else {
            endGame();
        }


    }

    const getMessage = () => {
        let titles = [];
        let subtitles = [];
        const percentCorrect = Math.round((correct.length / questions.length) * 100)
        if (percentCorrect >= 90 && percentCorrect <= 100) {
            titles = ["Wow! A plus work!",
                "You are awesome!",
                "Look at you!",
                "What an amazing performance!",
                "Impeccable performance!", "You are flawless!"];
            subtitles = ["Very phenomenal job!",
                "Looks like someone did their homework."];


        }
        else if (percentCorrect >= 80 && percentCorrect <= 89) {
            titles = ["OMG! What a stellar job", "Woah! exemplary execution!", "Fantastic!"];
            subtitles = ["You're becoming one to beat!", "You're crushing it!", "You are unstoppable!"];

        }
        else if (percentCorrect >= 70 && percentCorrect <= 79) {
            titles = ["Not half bad!", "Not bad!"]
            subtitles = ["Nothing less than a success.", "A valiant effort."]

        }
        else if (percentCorrect >= 60 && percentCorrect <= 69) {
            titles = ["A great effort!",
                "Good try!", "Don't give up!", "Don't worry!", "Keep trying!", "Don't quit now!"];
            subtitles = ["There's always room for improvement.",
                "Believe in yourself and you can do even better!",
                "You can try and fail, but never fail to try!"];

        }
        else {
            titles = ["Don't be discouraged...", "Aw, man!", "It's okay."];
            subtitles = ["It's only a minor setback.", "You can try and fail, but never fail to try!"];

        }
        const title = titles[Math.floor(Math.random() * titles.length)];
        const subtitle = subtitles[Math.floor(Math.random() * subtitles.length)];
        return [title, subtitle];

    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            {!isPlaying &&
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay} />}

            <Header
                backButton={assets.close}
                style={{ zIndex: 3 }}
                color={Colors.white}
                headerRight={isPlaying && time != "untimed" &&
                    <Animated.View exiting={ZoomOut} entering={ZoomIn.springify()}>
                        <CircularProgressBar
                            startValue={0}
                            inactiveColor={ACCENT_COLOR}
                            strokeWidth={5}
                            size={50}
                            endValue={game.time}
                            progress={game.time}
                            duration={game.time * 1000}
                            activeColor={Colors[colorScheme].background}
                            title={time}
                            titleColor={Colors.white}
                        />
                    </Animated.View>}

            />


            <View style={{ height: 30, paddingHorizontal: 15 }}>


                {isPlaying &&
                    <Animated.View
                        entering={FadeIn}
                        exiting={ZoomOut}
                        style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        {questions.map((_, index) =>
                            <View
                                key={index}
                                style={[styles.progressBlock, {
                                    backgroundColor: index <= currentIndex ? Colors.primary : '#ffffff90',
                                    borderBottomLeftRadius: index == 0 ? 25 : 0,
                                    borderTopLeftRadius: index == 0 ? 25 : 0,
                                    borderBottomRightRadius: index == questions.length - 1 ? 25 : 0,
                                    borderTopRightRadius: index == questions.length - 1 ? 25 : 0,
                                    width: (SCREEN_WIDTH / questions.length) - 30,
                                }]} />
                        )}
                    </Animated.View>}

            </View>
            <View style={{ height: 150, marginTop: 20 }}>


                {showQuestion &&
                    < Animated.View exiting={SlideOutLeft.duration(100).springify()} entering={SlideInRight} style={{ alignSelf: 'center', backgroundColor: Colors[colorScheme].invertedTint, height: 150, justifyContent: 'center', alignItems: 'center', borderRadius: 20, ...SHADOWS[colorScheme], shadowColor: "#00000040", width: 300, padding: 25 }}>

                        <MediumText h4 style={{ textAlign: 'center' }}>
                            {isPlaying ? questions[currentIndex].question : ''}
                        </MediumText>


                        {questions[currentIndex].image &&
                            <CustomImage source={{ uri: questions[currentIndex].image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                        }
                    </Animated.View>

                }
            </View>


            {questions[currentIndex].answerChoices.map((item, index) => (

                showAnswers &&

                <ScaleButton
                    disabled={time == 0}
                    exiting={SlideOutLeft}
                    entering={SlideInRight}
                    onPress={() => handleAnswer(item)}
                    key={index}
                    style={[styles.answerChoiceContainer, {
                        zIndex: isPlaying ? 2 : 0, ...SHADOWS[colorScheme], shadowColor: '#00000060', borderColor: borderColors[index], backgroundColor: colors[index],
                    }]}>

                    <MediumText white h5>{isPlaying ? item : ''}</MediumText>


                </ScaleButton>

            )
            )}
            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 1 }}>

                {isCountingDown &&
                    <Animated.View entering={ZoomIn} exiting={ZoomOut} >


                        <MediumText h1 white>{countdown}</MediumText>
                    </Animated.View>

                }


                {
                    !isPlaying && !isGameEnded && !isCountingDown &&

                    <ScaleButton
                        entering={ZoomIn}
                        exiting={ZoomOut}
                        onPress={() => setIsCountingDown(true)}
                        style={styles.button}>

                        <MediumText white h3 style={{ marginLeft: 10 }}>Start</MediumText>
                    </ScaleButton>

                }


                {isGameEnded && !isCountingDown &&
                    <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                        <Animated.View entering={SlideInUp.duration(1000).springify()} exiting={FadeOut}>


                            <CircularProgressBar
                                delay={1000}
                                titleColor={Colors.white}
                                title={percentCorrect + '%'}
                                fontSize={36}
                                startValue={0}
                                size={180}
                                duration={1000}
                                endValue={100}
                                progress={percentCorrect}
                                activeColor={ACCENT_COLOR}
                                inactiveColor='#3B155E'
                                style={{ marginBottom: 50 }} />
                        </Animated.View>

                        <Animated.View layout={Layout.duration(500)} entering={FadeIn.delay(1000)} exiting={FadeOut}>
                            <View style={{ height: 80 }}>

                                <MediumText white h2 style={{ textAlign: 'center', }}>{"Your Score: "}{animatedScore}</MediumText>


                                {showScoreAfterBonus && timeBonus > 0 &&
                                    <Animated.View style={{ alignSelf: 'flex-end' }} layout={Layout.duration(500)} exiting={FadeOut} entering={FadeInDown}>
                                        <MediumText h4 style={{ color: Colors.yellow, textAlign: 'center' }}>{" + "}{timeBonus}</MediumText>

                                    </Animated.View>}



                            </View>
                            <MediumText white h2 style={{ textAlign: 'center' }}>{gameOverTitle}</MediumText>
                            <RegularText white h4 style={{ textAlign: 'center', marginBottom: 40 }}>{gameOverSubtitle}</RegularText>
                        </Animated.View>






                        <ScaleButton
                            onPress={() => props.navigation.navigate('Share', {
                                message: {
                                    specialChatItem: game,
                                    text: "I played " + game.title + ", got " + ((correct.length / questions.length) * 100) + "% correct and scored " + (score + timeBonus) + " points! Can you beat it?",
                                    media: null,
                                    contentType: 'desk item'
                                }
                            })}
                            entering={ZoomIn.delay(500).springify()}
                            exiting={ZoomOut}
                            style={[styles.button, { marginTop: 30, backgroundColor: '#6CCEFF' }]}>
                            <CustomImage source={assets.send} style={{ width: 25, height: 25, tintColor: Colors.white, transform: [{ rotate: '45deg' }] }} />

                            <MediumText h3 white style={{ marginLeft: 10 }}>{"Share"}</MediumText>

                        </ScaleButton>

                        <ScaleButton
                            entering={ZoomIn.delay(600).springify()}
                            exiting={ZoomOut}

                            style={[styles.button, { marginTop: 20 }]}
                            onPress={() => setIsCountingDown(true)}>

                            <CustomImage source={assets.flip} style={{ width: 30, height: 30, tintColor: Colors.white }} />
                            <MediumText white h3 style={{ marginLeft: 10 }}>{"Restart"}</MediumText>
                        </ScaleButton>

                    </View>



                }

            </View >


        </View >
    )
}
const styles = StyleSheet.create({
    answerChoiceContainer: {
        shadowRadius: 3,
        marginHorizontal: 15,
        borderBottomWidth: 8,
        borderWidth: 2,
        padding: 20,
        minHeight: 70,
        borderRadius: 10,
        marginVertical: 20
    },


    progressBlock: {
        height: 20,
        marginRight: 8,
    },

    progress: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 90,
        height: 90,
        borderRadius: 50,
        borderWidth: 15,
        borderColor: '#6CCEFF'

    },
    overlay: {
        height: '100%',
        width: '100%',
        backgroundColor: '#64249E90',
        zIndex: 1,
        position: 'absolute'
    },

    button: {
        width: 200,
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        zIndex: 2
    }
})
export default Game