import { View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import { descriptions, styles } from '.'
import { auth, db, } from '../../Firebase/firebase'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Input from '../../components/StyledTextInput'
import useColorScheme from '../../hooks/useColorScheme'
import { checkUniqueUsername, checkValidUsername } from '../../utils'
import { updateUser } from '../../services/user'
import { RegularText } from '../../components/StyledText'

const UsernameSettings = (props) => {
    const colorScheme = useColorScheme();
    const [username, setUsername] = useState(props.route.params.username || '');
    const [loading, setLoading] = useState(false);
    const [loadingUsername, setLoadingUsername] = useState(false);
    const [error, setError] = useState('');
    const onNextPressed = () => {
        props.navigation.navigate('SignUpBirthday', { ...props.route.params, username: username.trim() })
    }
    const onSavePress = () => {
        setLoading(true);

        updateUser({ username })
            .then(() => {
                setLoading(false)
                props.navigation.goBack();
            });

    }


    const onChangeUsername = (value) => {
        value = value.replace(' ', '_');
        setLoadingUsername(true);

        setError('')

        setUsername(value)
        if (value != props.route.params.username) {


            if (value) {
                if (checkValidUsername(value, setError)) {
                    checkUniqueUsername(value)
                        .then(() => {
                            setLoadingUsername(false)
                            console.log("first")

                        })
                        .catch((e) => {
                            setError(e);
                            console.log("first")
                            setLoadingUsername(false);
                        });
                }
                else {
                    setLoadingUsername(false);
                }



            }
            else {
                setError("Please choose a username");
                setLoadingUsername(false);
            }
        }
        else {
            setLoadingUsername(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
                <Header
                    navigation={props.navigation}
                    direction={'horizontal'}
                    title={'Username'}

                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="height">
                    <View style={styles.mainContainer}>

                        <RegularText darkgray style={styles.description}>{descriptions.username}</RegularText>


                        <View style={{ paddingHorizontal: 30, marginVertical: 20 }}>
                            <Input
                                autoFocus
                                loading={loadingUsername}
                                placeholder='Name'
                                value={username}
                                onChangeText={onChangeUsername}

                            />
                            <RegularText style={styles.errorMessage}>{error}</RegularText>

                        </View>



                        {props.route.params.useCase == 'sign up' &&
                            <Button
                                onPress={onNextPressed}
                                title={'Next'}
                                style={{ width: '50%', marginTop: 20 }}
                                disabled={username.trim().length < 2}

                            />}




                    </View>
                    {props.route.params.useCase == 'settings' &&

                        <Button
                            title='Save'
                            disabled={username.trim() == props.route.params.username || !username.trim() || error || loadingUsername}
                            onPress={onSavePress}
                            loading={loading}
                            colors={[Colors.primary, Colors.primary]}
                            style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0, marginTop: 30 }}

                        />
                    }
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default UsernameSettings