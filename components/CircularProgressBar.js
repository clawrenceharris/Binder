import { View, Text, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { MediumText } from './StyledText'

const CircularProgressBar = ({ title, size, endValue, delay, duration, fontSize, titleColor, titleStyle, inactiveColor, strokeWidth, startValue, progress, activeColor, style, ...props }) => {
    const animatedValue = useRef(new Animated.Value(startValue)).current;
    const maxValue = props.maxValue ? props.maxValue : 100;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            useNativeDriver: true,
            delay,
            duration


        }).start();






    }, [progress])
    const firstCircleRotate = animatedValue.interpolate({
        inputRange: [0, endValue / 2],
        outputRange: ['0deg', '180deg'],
        extrapolate: 'clamp'
    });
    const secondCircleRotate = animatedValue.interpolate({
        inputRange: [0, endValue],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'clamp'
    });
    const secondCircleOpacity = animatedValue.interpolate({
        inputRange: [0, (endValue / 2) - 1, endValue / 2, endValue],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp'
    });

    const styles = StyleSheet.create({


        activeCircle: {
            width: size || 190,
            height: size || 190,
            position: 'absolute',
            borderRadius: (size || 100) / 2,
            borderWidth: strokeWidth || 20,

            borderBottomColor: 'transparent',
            borderRightColor: 'transparent'

        },

        cover: {
            position: 'absolute',

            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            width: size || 190,
            height: size || 190,
            borderRadius: (size || 100) / 2,
            borderWidth: strokeWidth || 20

        },
        inactiveCircle: {

            justifyContent: 'center',
            alignItems: 'center',
            width: size || 190,
            height: size || 190,
            borderRadius: (size || 100) / 2,
            borderWidth: strokeWidth || 20,
        },



    })
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
            <MediumText h2 style={{ position: 'absolute', color: titleColor, fontSize, ...titleStyle }}>{title}</MediumText>
            <Animated.View
                style={[styles.inactiveCircle, {
                    transform: [{ rotate: '-45deg' }],
                    borderColor: inactiveColor,
                }]}>

                <Animated.View style={[styles.activeCircle, {
                    borderLeftColor: activeColor,
                    borderTopColor: activeColor,
                    transform: [{ rotate: firstCircleRotate || '0deg' }]
                }]} />
                <View style={[styles.cover, {
                    borderLeftColor: inactiveColor,
                    borderTopColor: inactiveColor,
                }]} />
                <Animated.View style={[styles.activeCircle, {
                    borderLeftColor: activeColor,
                    borderTopColor: activeColor,
                    opacity: secondCircleOpacity,
                    transform: [{ rotate: secondCircleRotate || '0deg' }]
                }]} />

            </Animated.View>
        </View>

    )
}

export default CircularProgressBar