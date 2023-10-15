import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { LinearGradient } from 'expo-linear-gradient';
import { SHADOWS } from '../constants/Theme';
import { ActivityIndicator } from 'react-native-paper';
import { MediumText } from './StyledText';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const TIMING_CONFIG = {
    duration: 150,
    damping: 80,
    overshootClamping: true,
    stiffness: 500,
    restSpeedThreshold: 0.1,
    restDisplacementThreshold: 0.1
}
const Button = ({ disabled, animationEnabled, colors, type, activeOpacity, onPress, style, title, tint, titleStyle, icon, loading, ...props }) => {
    const scale = useSharedValue(1);
    const colorScheme = useColorScheme();
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)



    const onButtonPress = () => {

        if (!disabled && !loading && onPress)

            setTimeout(() => onPress(), 150)



    }

    const styles = StyleSheet.create({
        buttonContainer: {
            borderRadius: 50,
            alignSelf: 'center',
            padding: 5,
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,

        },
        title: {
            color: tint || Colors.white,
            fontFamily: "KanitMedium",
            fontSize: 20
        }
    });
    const animatedStyles = useAnimatedStyle(() => ({

        transform: [{ scale: withTiming(scale.value, TIMING_CONFIG) }]
    }))

    return (

        <TouchableWithoutFeedback
            onPressIn={() => scale.value = type == 'zoom-in' ? 1.1 : 0.9}
            onPressOut={() => scale.value = 1}
            disabled={disabled}
            onPress={onButtonPress}>


            <AnimatedLinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={disabled ? [Colors[colorScheme].gray, Colors[colorScheme].gray] : colors ? colors : ['#73C0F8', Colors.blue]}
                style={[styles.buttonContainer, animatedStyles, style]}>



                {!loading ?
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        {icon}

                        {title && <MediumText h4 style={{ color: tint || Colors.white, marginLeft: icon && 3, ...titleStyle }}>{title}</MediumText>}
                    </View>
                    :
                    <ActivityIndicator color={tint || Colors.white} size={'small'} />
                }



            </AnimatedLinearGradient>
        </TouchableWithoutFeedback>

    )


}

export default Button