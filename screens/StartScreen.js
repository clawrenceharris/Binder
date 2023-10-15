import { View, ImageBackground, Text, Image } from 'react-native'
import React from 'react'
import { assets, Colors } from '../constants'
import Button from '../components/Button'
import { LinearGradient } from 'expo-linear-gradient'
import CustomImage from '../components/CustomImage'
import { SHADOWS } from '../constants/Theme'
import useColorScheme from '../hooks/useColorScheme'
import { haptics } from '../utils'
import CustomFastImage from '../components/CustomFastImage'

const StartScreen = (props) => {
    const colorScheme = useColorScheme();
    const onSignUpPress = () => {
        haptics('light');
        props.navigation.navigate('SignUpEmail');
    }
    const onLogInPress = () => {
        haptics('light');
        props.navigation.navigate('Login');
    }
    return (
        <View
            style={{ backgroundColor: Colors[colorScheme].background, flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>

            <CustomImage source={assets.school_background} style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }} />
            <CustomImage source={assets.logo} style={{ width: 200, height: 200 }} />

            <View style={{ width: '100%' }}>


                <View style={{ ...SHADOWS[colorScheme] }}>


                    <Button
                        onPress={onLogInPress}
                        style={{ width: '45%', ...SHADOWS[colorScheme] }}
                        title={'Log In'}
                        animated


                    />
                </View>
                <View style={{ ...SHADOWS[colorScheme], width: '100%%' }}>


                    <Button
                        onPress={onSignUpPress}
                        style={{ marginTop: 20, width: '45%', }}
                        tint={Colors.accent}
                        colors={[Colors.white, Colors.white]}
                        title={'Join'}
                        animated

                    />



                </View>
            </View>
        </View>

    )
}

export default StartScreen