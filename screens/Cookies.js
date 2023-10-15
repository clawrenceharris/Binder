import { View, Text, Image, Animated, LogBox } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { mainContainerStyle } from '../GlobalStyles'
import useColorScheme from '../hooks/useColorScheme'
import { assets, Colors } from '../constants'
import { connect } from 'react-redux'
import { SHADOWS } from '../constants/Theme'
import { auth, db } from '../Firebase/firebase'
import firebase from 'firebase/compat/app'
import MaskedView from "@react-native-masked-view/masked-view"
import Button from '../components/Button'
const Cookies = (props) => {
    const colorScheme = useColorScheme()
    const { currentUser, cookieCheckIn, ranks, rank } = props

    var countDownDate = new Date("Feb 2, 2023 13:0:0").getTime();
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [emojiRainActive, setEmojiRainActive] = useState(false)
    const cookieScaleValue = useRef(new Animated.Value(1)).current
    const [rankPercentage, setRankPercentage] = useState(0)
    const AnimatedView = Animated.createAnimatedComponent(View)
    const widthAnimation = new Animated.Value(0)
    const AnimatedMaskedView = Animated.createAnimatedComponent(MaskedView);
    const widthInterpolate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    })
    LogBox.ignoreLogs(['FirebaseError: Function CollectionReference.doc() cannot be called with an empty path.'])

    const animatedStyles = {
        width: widthInterpolate
    }
    const scaleCookie = () => {
        Animated.sequence([
            Animated.timing(cookieScaleValue, {
                toValue: 1.5,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(cookieScaleValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })

        ]).start()
    }
    const getRankWidth = () => {
        let rankPercentage = 0
        if (ranks[0].id !== rank.id && ranks[ranks.length - 1].id !== rank.id) {
            if (rankPercentage > 1)
                rankPercentage = 1
            else
                rankPercentage = ((currentUser.cookies - rank.minCookies) / rank.maxCookies)

        }
        else {

            if (currentUser.cookies / rank.maxCookies > 1)
                rankPercentage = 1

            else
                rankPercentage = currentUser.cookies / rank.maxCookies

        }


        return rankPercentage * 100 + '%'

    }

    useEffect(() => {
        // if (currentUser.rank != rank.name) {
        //     db.collection('users')
        //         .doc(auth.currentUser.uid)
        //         .update({
        //             rank: rank.name
        //         }).catch((e) => console.log("error updating rank: " + e.message))
        // }

    }, [currentUser.cookies])


    const onCheckInPress = () => {
        setCanCheckIn(false)

        db.collection('users')
            .doc(auth.currentUser.uid)
            .update({
                cookieCheckIn: new Date().getTime(),
                cookies: firebase.firestore.FieldValue.increment(1)
            })
        scaleCookie()
    }
    const [canCheckIn, setCanCheckIn] = useState(true || cookieCheckIn < new Date().getDate())

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={[{ ...mainContainerStyle, backgroundColor: colorScheme === 'light' ? '#F8F8F8' : Colors.dark.background }]}>


                <View style={{ flexDirection: 'row', ...SHADOWS[colorScheme], borderRadius: 15, backgroundColor: Colors[colorScheme].invertedTint, padding: 20, width: '100%' }}>

                    <View style={{ width: '50%', justifyContent: 'center', borderRightWidth: 1, borderColor: Colors[colorScheme].gray, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Kanit', color: Colors[colorScheme].darkGray }}>{"Cookies"}</Text>

                        <Animated.View style={{ transform: [{ scale: cookieScaleValue }] }}>


                            <Text style={{ fontSize: 18, fontFamily: 'KanitMedium', color: Colors[colorScheme].tint }}>{"🍪 " + currentUser.cookies}</Text>

                        </Animated.View>

                    </View>

                    <View style={{ width: '50%', paddingLeft: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Kanit', color: Colors[colorScheme].darkGray }}>{"Coins"}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                            <Text style={{ fontSize: 18, fontFamily: 'KanitMedium', color: Colors[colorScheme].tint, marginLeft: 5 }}>{currentUser?.coins || 0}</Text>



                        </View>
                    </View>

                </View>

                <View style={{ marginTop: 20, ...SHADOWS[colorScheme], backgroundColor: colorScheme === 'light' ? Colors.white : Colors.light.tint, borderRadius: 15, padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image source={assets.rank} style={{ width: 20, height: 20, tintColor: Colors.primary }} />


                        <Text style={{ fontFamily: 'KanitMedium', fontSize: 18, color: Colors.primary, marginLeft: 5 }}>{rank.name}</Text>
                    </View>







                    <View style={{ backgroundColor: colorScheme === 'light' ? '#D5DFE380' : Colors.dark.lightGray, width: '100%', height: 15, marginTop: 10, borderRadius: 50 }}>




                        <AnimatedMaskedView
                            style={{ height: 40, borderRadius: 50, width: getRankWidth() }}
                            maskElement={
                                <View
                                    style={{
                                        // Transparent background because mask is based off alpha channel.
                                        backgroundColor: 'transparent',



                                    }}
                                >

                                    <View style={{ backgroundColor: Colors.primary, width: (currentUser.cookies / rank.maxCookies) * 100 <= 100 ? ((currentUser.cookies) / rank.maxCookies) * 100 + '%' : '100%', height: 15, borderRadius: 50 }} />
                                </View>

                            }
                        >

                            <View style={{ flex: 1, height: '100%', backgroundColor: Colors.primary }}>
                                <Image source={assets.stars} style={{ width: 400, flex: 1, opacity: 0.6 }} />

                            </View>

                        </AnimatedMaskedView>
                    </View>





                    <Text style={{ fontFamily: 'Kanit', color: colorScheme === 'light' ? Colors.light.darkGray : Colors.dark.lightGray, marginTop: 5 }}>
                        {rank.maxCookies - currentUser.cookies >= 0 ? rank.maxCookies - currentUser.cookies + " Cookies until next Rank Up!" : "You're at the highest rank! 🤩"}
                    </Text>

                </View>
                <View style={{ marginTop: 20, ...SHADOWS[colorScheme], backgroundColor: colorScheme === 'light' ? Colors.white : Colors.light.tint, borderRadius: 15, padding: 20 }}>


                    <Text style={{ fontFamily: 'KanitMedium', fontSize: 20, color: Colors[colorScheme].tint }}>{"Daily Bonus"}</Text>
                    <Text style={{ fontFamily: 'Kanit', color: Colors[colorScheme].darkGray }}>{"Check in each day to recieve free cookies!"}</Text>
                    <Button

                        title={canCheckIn ? 'Claim Cookies' : ''}
                        onPress={onCheckInPress}
                        style={{ marginTop: 20 }}
                        icon={<></>
                        }
                        disabled={!canCheckIn}

                    />



                </View>

            </View >

        </View >
    )
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    ranks: store.ranksState.ranks,
    cookieCheckIn: store.userState.cookieCheckIn,
    rank: store.userState.rank
})
export default connect(mapStateToProps, null)(Cookies)