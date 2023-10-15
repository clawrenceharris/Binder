import { Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useRef } from 'react'
import { haptics } from '../utils'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const TIMING_CONFIG = {
    duration: 150,
    damping: 80,
    overshootClamping: true,
    stiffness: 500,
    restSpeedThreshold: 0.1,
    restDisplacementThreshold: 0.1
}
const ScaleButton = ({ toValue, style, onPress, color, onLongPress, disabled, ...props }) => {
    const scaleValue = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => ({

        transform: [{ scale: withTiming(scaleValue.value, TIMING_CONFIG) }]
    }))




    return (
        <TouchableWithoutFeedback
            onPressIn={() => scaleValue.value = toValue || 0.9}
            onPressOut={() => scaleValue.value = 1}
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={disabled}
        >

            <Animated.View

                style={[animatedStyles, { backgroundColor: color, justifyContent: 'center', alignItems: 'center' }, style,]}
                {...props}
            >



                {props.children}


            </Animated.View>
        </TouchableWithoutFeedback>

    )
}

export default ScaleButton