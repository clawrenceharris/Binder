import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { db } from '../../Firebase/firebase'
import { Colors } from '../../constants'
import useColorScheme from '../../hooks/useColorScheme'
import StyledTextInput from '../../components/StyledTextInput'
import Button from '../../components/Button'
import { descriptions, styles } from '.'
import Header from '../../components/Header'
import { checkUniqueUsername, checkValidUsername } from '../../utils'
import { MediumText, RegularText } from '../../components/StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const SignUpUsername = (props) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const onNextPress = () => {
        if (!error) {
            props.navigation.navigate('SignUpSchool', { ...props.route.params, username: username.toLowerCase() });
        }
    }

    const onChangeUsername = (value) => {
        value = value.replace(' ', '_');
        setError('');
        let isValidUsername = false;
        setUsername(value);
        if (value) {
            setLoading(true);
            isValidUsername = checkValidUsername(value, setError);

            checkUniqueUsername(value)
                .then(() => setLoading(false))
                .catch(setError);
        }
        else {
            setError("Please choose a username");
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

                <Header color={Colors.accent} />
                <View style={{ paddingHorizontal: 15 }}>
                    <MediumText h3 style={{ marginBottom: 10, textAlign: 'center' }}>{"Create a username"}</MediumText>
                    <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.username}</RegularText>
                    <View style={{ paddingHorizontal: 30 }}>


                        <StyledTextInput
                            autoFocus
                            placeholder='Username'
                            onChangeText={onChangeUsername}
                            value={username}
                            error={error}
                            autoCapitalize={'none'}
                            loading={loading}
                        />
                    </View>
                    <RegularText style={styles.errorMessage}>{error}</RegularText>

                    <Button
                        onPress={onNextPress}
                        title={'Next'}
                        style={{ marginTop: 20, paddingHorizontal: 40 }}
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

export default SignUpUsername