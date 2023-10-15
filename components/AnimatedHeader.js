import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated
} from 'react-native'
import React from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { SafeAreaView } from 'react-native'
import { MediumText } from './StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { SIZES } from '../constants/Theme'
import CustomImage from './CustomImage'

const AnimatedHeader = (
    {
        animatedValue,
        animatedTitle,
        inputRange,
        headerLeft,
        headerCenter,
        headerRight,
        title,
        color,
        onBackPress,
        textStyle,
        backButton,
        direction,
        headerCenterStyle,
        titleInputRange,
        style }
) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const headerBackgroundColor = animatedValue.interpolate({
        inputRange: inputRange || [0, 100],
        outputRange: [Colors[colorScheme].background, Colors[colorScheme].invertedTint],
        extrapolate: 'clamp',
    });

    const headerBorderColor = animatedValue.interpolate({
        inputRange: inputRange || [0, 100],
        outputRange: [Colors[colorScheme].background, Colors[colorScheme].gray],
        extrapolate: 'clamp',
    });


    const headerTitleOpacity = animatedValue.interpolate({
        inputRange: titleInputRange || [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    })

    return (


        <Animated.View style={[styles.mainContainer, {
            borderTopLeftRadius: direction === 'vertical' ? 15 : 0,
            borderTopRightRadius: direction === 'vertical' ? 15 : 0,
            height: SIZES.header + insets.top,
            borderBottomColor: headerBorderColor,

            ...style
        }]}>
            <View>


                {headerLeft ||




                    <TouchableWithoutFeedback
                        onPress={() => { onBackPress ? onBackPress() : navigation.goBack() }}>




                        <View style={{}}>
                            {direction === 'vertical' ?
                                <CustomImage
                                    source={backButton || assets.left_arrow}
                                    style={{ width: 22, height: 22, tintColor: color || Colors[colorScheme].tint, transform: [{ rotate: '-90deg' }] }}
                                />

                                :

                                <CustomImage
                                    source={backButton || assets.left_arrow}
                                    style={{ width: 22, height: 22, tintColor: color || Colors[colorScheme].tint }}
                                />

                            }
                        </View>
                    </TouchableWithoutFeedback>

                }
            </View>



            <View style={[styles.headerCenter, { ...headerCenterStyle }]}>


                {headerCenter ||
                    <View>

                        <MediumText h3 style={{ textAlign: 'center', color: color || Colors[colorScheme].tint, ...textStyle }}>{title}</MediumText>

                        {animatedTitle &&
                            <Animated.View style={{ opacity: headerTitleOpacity }}>


                                <MediumText h3 style={{ textAlign: 'center', color: color || Colors[colorScheme].tint, ...textStyle }}>{animatedTitle}</MediumText>
                            </Animated.View>}
                    </View>


                }
            </View>




            <View style={{ right: 15 }}>

                {headerRight}

            </View>

        </Animated.View>


    )
}


const styles = StyleSheet.create({



    mainContainer: {

        flexDirection: 'row',
        padding: 15,
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderBottomWidth: 1,


    },
    headerCenter: {
        flex: 1,





    }
})

export default AnimatedHeader