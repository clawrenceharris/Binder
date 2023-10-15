import { View, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import { SHADOWS } from '../../constants/Theme'
import { descriptions, styles } from '.'
import { auth } from '../../Firebase/firebase'
import firebase from 'firebase/compat/app'
import Header from '../../components/Header'
import Input from '../../components/StyledTextInput'
import useColorScheme from '../../hooks/useColorScheme'
import { SubmitModal } from '../../components/Modals'
import { getErrorMessage } from '../../utils'
import SlideModal from '../../components/SlideModal'
import { RegularText } from '../../components/StyledText'
import StyledTextInput from '../../components/StyledTextInput'
import Button from '../../components/Button'
import { updateUser } from '../../services/user'
import { reauthenticate } from '../../redux/actions/auth'


const EmailSettings = (props) => {
    const [email, setEmail] = useState(props.route.params.email)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [password, setPassword] = useState('');
    const colorScheme = useColorScheme();
    const [loading, setLoading] = useState(false);




    function changeEmail() {
        setLoading(true);

        reauthenticate(password)
            .then(() => {

                updateUser({ email })
                    .then(() => {
                        var user = auth.currentUser;
                        user.updateEmail(email)
                            .then(() => {

                                setErrorMessage('');
                                props.navigation.goBack();
                                props.onTaskComplete("Email successfully updated!");
                                setLoading(false);

                            }).catch((e) => {
                                setLoading(false);
                                console.error(e);
                                setErrorMessage(getErrorMessage(e.message));
                                updateUser({ email: props.route.params.email })
                            });
                    })
                    .catch(e => {
                        setLoading(false);
                        console.error(e);
                        setErrorMessage(getErrorMessage(e.message));
                    })

            }).catch((e) => {
                setLoading(false);
                console.error(e);
                setErrorMessage(getErrorMessage(e.message));

            });
        return null

    }

    const handleSave = () => {
        setErrorMessage('')
        setSuccessMessage("");

        setShowModal(true)
    }


    return (


        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header
                title={'Email'}
            />
            <SlideModal
                toValue={0.5}
                showModal={showModal}
                onCancel={() => setShowModal(false)}>


                <SubmitModal
                    title="Password"
                    subtitle={"Wait a sec! For security, enter your password first."}
                    onSubmitPress={() => {
                        setShowModal(false);
                        setPassword('')
                        changeEmail()
                    }}
                    onCancelPress={() => setShowModal(false)}
                >

                    <Input
                        placeholder='Password'
                        autoFocus
                        value={password}
                        onChangeText={(value) => { setPassword(value); }}
                        secureTextEntry
                        style={{ width: '100%', alignSelf: 'center' }}
                        placeholderTextColor={'#00000080'}
                    />

                </SubmitModal>
            </SlideModal>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="height">
                <View style={{ padding: 20 }}>


                    <View style={{ marginTop: 20, backgroundColor: Colors[colorScheme].background, padding: 20, borderRadius: 25 }}>



                        <StyledTextInput
                            returnKeyType='done'
                            placeholder='Email'
                            onChangeText={(value) => {
                                setEmail(value);
                                setErrorMessage('');
                                setSuccessMessage('')
                            }}
                            value={email}

                        />


                        <RegularText style={styles.errorMessage}>{errorMessage}</RegularText>
                        <RegularText style={styles.successMessage}>{successMessage}</RegularText>





                    </View>

                </View>
                <Button
                    title='Save'
                    disabled={email.trim().toLowerCase() == props.route.params.email || !email.trim()}
                    onPress={handleSave}
                    loading={loading}
                    colors={[Colors.primary, Colors.primary]}
                    style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0 }}

                />
            </KeyboardAvoidingView>
        </View >

    )
}

export default EmailSettings