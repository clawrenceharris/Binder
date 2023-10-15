import {
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native'
import React, { useState } from 'react'
import Button from '../../components/Button';
import { styles } from '.';
import { Colors } from '../../constants';
import Header from '../../components/Header';
import { db } from '../../Firebase/firebase';
import StyledTextInput from '../../components/StyledTextInput';
import useColorScheme from '../../hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { isValidEmail, isValidPassword } from '../../utils';
import { EMAIL_ALREADY_IN_USE, INVALID_EMAIL, WEAK_PASSWORD } from '../../constants/ErrorMessages';
import { descriptions } from '.';
import { MediumText, RegularText } from '../../components/StyledText';
import { isEmailInUse } from '../../services/user';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SignUpEmail = (props) => {
    const colorScheme = useColorScheme()
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('')

    const insets = useSafeAreaInsets();




    const onNextPress = () => {
        setEmailError('');
        setPasswordError('');
        setLoading(true);
        if (isValidEmail(email)) {
            isEmailInUse(email.trim().toLowerCase())
                .then((isInUse) => {
                    if (isInUse) {
                        setEmailError(EMAIL_ALREADY_IN_USE)
                        setLoading(false);

                    }
                    else {
                        if (isValidPassword(password)) {
                            props.navigation.navigate('SignUpName', { email: email.toLowerCase().trim(), password });
                            setLoading(false);

                        }
                        else {
                            setPasswordError(WEAK_PASSWORD);
                            setLoading(false);

                        }
                    }
                })


        } else {
            setEmailError(INVALID_EMAIL);
            setLoading(false);
        }
    }




    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={{ flex: 1, backgroundColor: colorScheme === 'light' ? Colors.white : Colors.dark.background }}>
                <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />

                <Header color={Colors.accent} />

                <View style={{ paddingHorizontal: 15 }}>


                    <MediumText h3 style={{ marginBottom: 10, textAlign: 'center' }}>{"Enter an email and password"}</MediumText>
                    <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.email}</RegularText>
                    <View
                        style={{ paddingHorizontal: 30 }}>

                        <StyledTextInput
                            placeholder="Email"
                            keyboardType='email-address'
                            value={email}
                            autoFocus
                            onChangeText={(value) => {
                                setEmail(value);
                                setEmailError('');

                            }}
                        />





                        <RegularText style={styles.errorMessage}>{emailError}</RegularText>

                        <StyledTextInput
                            containerStyle={{ marginTop: 30 }}
                            placeholder='Password'
                            value={password}
                            secureTextEntry
                            onChangeText={(value) => {
                                setPassword(value);
                                setPasswordError('');

                            }}


                        />
                        <RegularText style={styles.errorMessage}>{passwordError}</RegularText>

                        <Button
                            title={'Next'}
                            style={{ marginTop: 20, paddingHorizontal: 40, }}
                            onPress={onNextPress}
                            disabled={!email.trim()}
                            loading={loading}
                        />


                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: insets.bottom, width: '100%' }}>


                    <RegularText darkgray>

                        <RegularText darkgray>{"Already have an account?"}</RegularText>
                        {" "}
                        <MediumText
                            accent
                            onPress={() => props.navigation.navigate('LogIn')}>
                            {"Log in"}
                        </MediumText>

                    </RegularText>
                </View>


            </View>


        </TouchableWithoutFeedback>
    )

}

export default SignUpEmail