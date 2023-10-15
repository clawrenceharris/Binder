import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { StyleSheet, View } from "react-native"

export const TwelvePointBurst = (props) => {
    const borderRadius = 4
    const styles = StyleSheet.create({
        twelvePointBurst: {},
        twelvePointBurstMain: {
            width: props.size || 80,
            height: props.size || 80,
            borderRadius
        },
        twelvePointBurst30: {
            width: props.size || 80,
            height: props.size || 80,
            position: 'absolute',
            borderRadius,
            top: 0,
            right: 0,
            transform: [
                { rotate: '30deg' }
            ]
        },
        twelvePointBurst60: {
            width: props.size || 80,
            height: props.size || 80,
            position: 'absolute',
            top: 0,
            borderRadius,
            right: 0,
            transform: [
                { rotate: '60deg' }
            ]
        },
    })
    return (
        <View style={[styles.twelvePointBurst, { ...props.style }]}>
            <LinearGradient colors={props.colors} style={styles.twelvePointBurstMain} />
            <LinearGradient colors={props.colors} style={styles.twelvePointBurst30} />
            <LinearGradient colors={props.colors} style={styles.twelvePointBurst60} />
            {props.children}
        </View>
    )
}




