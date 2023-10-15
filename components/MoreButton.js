import { View, Text, TouchableOpacity, Image, ViewStyle, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { SHADOWS } from '../constants/Theme'


const MoreButton = (props) => {
    const colorScheme = useColorScheme()

    return (
        <View style={[
            styles.container,
            {

                ...props.style
            }
        ]}>


            <TouchableWithoutFeedback
                onPress={props?.onPress}>



                <Image source={assets.more} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].tint }} />
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: 'center',

        justifyContent: 'center'
    }
})

export default MoreButton