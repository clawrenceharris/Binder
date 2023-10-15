import { View, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { assets, Colors } from '../constants'
import CustomImage from '../components/CustomImage'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const FullScreenMedia = ({ route, navigation }) => {
    const { media } = route.params
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar style='light' />
            <CustomImage source={{ uri: media }} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
            <TouchableWithoutFeedback onPress={() => navigation.pop()}>
                <View style={{ left: 15, top: 15 + insets.top, position: 'absolute', }}>
                    <CustomImage source={assets.close} style={{ width: 22, height: 22, tintColor: Colors.white }} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default FullScreenMedia