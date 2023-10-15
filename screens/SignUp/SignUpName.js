import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import useColorScheme from '../../hooks/useColorScheme'
import { descriptions, styles } from '.'
import Button from '../../components/Button'
import Header from '../../components/Header'

import StyledTextInput from '../../components/StyledTextInput'
import { MediumText, RegularText } from '../../components/StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SignUpName = (props) => {
    const [displayName, setDisplayName] = useState('')
    const colorScheme = useColorScheme()
    const insets = useSafeAreaInsets();

    const onNextPressed = () => {
        props.navigation.navigate('SignUpBirthday', { ...props.route.params, displayName: displayName.trim() })
    }





    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={{ flex: 1, backgroundColor: colorScheme === 'light' ? Colors.white : Colors.dark.background }}>
                <Header color={Colors.accent} />


                <View style={{ alignItems: 'center', paddingHorizontal: 15 }}>

                    <MediumText h3 style={{ marginBottom: 10 }}>{"Add your name"}</MediumText>
                    <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.name}</RegularText>
                    <View style={{ paddingHorizontal: 30 }}>


                        <StyledTextInput
                            autoFocus
                            isClearable
                            placeholder='Name'
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoCapitalize={'words'}


                        />
                    </View>


                    <Button
                        onPress={onNextPressed}
                        title={'Next'}
                        style={{ marginTop: 20, paddingHorizontal: 40, }}
                        disabled={displayName.trim().length < 2 || displayName.trim().length > 16}

                    />



                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: insets.bottom, width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RegularText darkgray>{"Already have an account? "}</RegularText>
                        <MediumText
                            accent
                            onPress={() => props.navigation.navigate('LogIn')}>
                            {"Log in"}
                        </MediumText>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>


    )
}


export default SignUpName
