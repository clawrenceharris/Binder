import { View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import Header from '../../components/Header'
import { descriptions, styles } from '.'
import useColorScheme from '../../hooks/useColorScheme'
import SlideModal from '../../components/SlideModal'
import { SubmitModal } from '../../components/Modals'
import { MediumText, RegularText } from '../../components/StyledText'
import StyledTextInput from '../../components/StyledTextInput'
import { auth } from '../../Firebase/firebase'
import { getErrorMessage, isValidPassword } from '../../utils'
import Button from '../../components/Button'
import { reauthenticate } from '../../redux/actions/auth'
import { useDispatch } from 'react-redux'
import { WEAK_PASSWORD } from '../../constants/ErrorMessages'

const PasswordSettings = (props) => {
    const colorScheme = useColorScheme();
    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const changePassword = () => {
        setLoading(true);
        reauthenticate(password)
            .then(() => {
                if (!isValidPassword(newPassword)) {
                    setLoading(false);
                    return setNewPasswordError(WEAK_PASSWORD);
                }
                var user = auth.currentUser;
                user.updatePassword(newPassword)
                    .then(() => {

                        setNewPasswordError('');
                        setPasswordError('');
                        props.navigation.goBack();
                        props.onTaskComplete("Password successfully updated!");
                        setLoading(false);
                    })
                    .catch(e => {
                        setLoading(false);
                        setNewPasswordError(getErrorMessage(e.message));
                    })
            })
            .catch(e => {
                setLoading(false);
                setPasswordError(getErrorMessage(e.message));
            })



    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header
                title={'Password'}

            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={"height"}>
                <View style={{ paddingHorizontal: 30 }}>
                    <RegularText darkgray style={styles.description}>{descriptions.password}</RegularText>


                    <StyledTextInput
                        containerStyle={{ marginTop: 30 }}
                        placeholder='Current password'
                        value={password}
                        secureTextEntry
                        onChangeText={(value) => {
                            setPassword(value);
                            setPasswordError('');

                        }}


                    />

                    <RegularText style={styles.errorMessage}>{passwordError}</RegularText>
                    <MediumText accent onPress={() => props.navigation.navigate('ResetPassword')} style={{ textAlign: 'right' }}>{"Forgot Password?"}</MediumText>


                    <StyledTextInput
                        containerStyle={{ marginTop: 30 }}
                        placeholder='New password'
                        value={newPassword}
                        secureTextEntry
                        onChangeText={(value) => {
                            setNewPassword(value);
                            setNewPasswordError('');

                        }}


                    />
                    <RegularText style={styles.errorMessage}>{newPasswordError}</RegularText>

                </View>

                <Button
                    title='Save'
                    disabled={!password || !newPassword}
                    onPress={changePassword}
                    loading={loading}

                    colors={[Colors.primary, Colors.primary]}
                    style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0 }}

                />
            </KeyboardAvoidingView>
        </View>
    )
}

export default PasswordSettings