import { View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import useColorScheme from '../hooks/useColorScheme'
import { Colors } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import { MediumText, RegularText } from '../components/StyledText';
import { descriptions, styles } from './Settings';
import StyledTextInput from '../components/StyledTextInput';
import { getErrorMessage, isValidEmail } from '../utils';
import { INVALID_EMAIL, WEAK_PASSWORD } from '../constants/ErrorMessages';
import { auth } from '../Firebase/firebase';
const ResetPassword = (props) => {



    const colorScheme = useColorScheme();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const [emailSent, setEmailSent] = useState(false);
    const sendEmail = () => {
        setEmailSent(false);
        auth.sendPasswordResetEmail(email)

            .then(() => setEmailSent(true))
            .catch((e) => {
                setEmailSent(false);
                console.log(e);
                setError(getErrorMessage(e.message))
            })
    }

    return (
        <View style={{ backgroundColor: Colors[colorScheme].background, flex: 1 }}>
            <Header title="Forgot Password" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS == "ios" ? "height" : "height"}>



                <View style={{ paddingHorizontal: 30 }}>
                    <RegularText darkgray style={styles.description}>{"Enter the email that belongs to the account"}</RegularText>


                    <StyledTextInput
                        containerStyle={{ marginTop: 30 }}
                        placeholder='Email'
                        value={email}
                        onChangeText={(value) => {
                            setEmail(value);
                            setError('');

                        }}


                    />

                    <RegularText style={styles.errorMessage}>{error}</RegularText>

                    {emailSent && <RegularText style={[styles.description, { marginTop: 30 }]}>


                        <RegularText darkgray >{"Check your email. We sent you a link to reset your password."}</RegularText>
                        <MediumText onPress={sendEmail} accent>{" "}{"Resend"}</MediumText>

                    </RegularText>}
                </View>

                {
                    !emailSent && <Button
                        title='Next'
                        disabled={!email}
                        style={{ paddingHorizontal: 50, marginTop: 20 }}
                        onPress={sendEmail}

                    />
                }

            </KeyboardAvoidingView >
        </View >
    )
}


export default ResetPassword