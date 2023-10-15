import { View, Image } from 'react-native'
import React, { useEffect } from 'react'
//import Svg, { Circle } from 'react-native-svg'
import { assets, Colors } from '../constants'
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

const CIRCLE_LENGTH = 300
const BIG_CIRLCE_LENGTH = CIRCLE_LENGTH + 60
const STROKE_WIDTH = 10
const RADIUS = CIRCLE_LENGTH / (2 * Math.PI)
const BIG_RADIUS = RADIUS + 10

//const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const CameraButton = ({ maxDuration }) => {
    const progress = useSharedValue(0)


    const moveRecordBar = () => {

        progress.value = withTiming(1, { duration: maxDuration })

    }

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: BIG_CIRLCE_LENGTH * (1 - progress.value),
        }
    })



}

export default CameraButton

