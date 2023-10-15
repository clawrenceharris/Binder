import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import { descriptions, styles } from '.'
import { auth, db, } from '../../Firebase/firebase'
import Header from '../../components/Header'
import Button from '../../components/Button'
import Input from '../../components/StyledTextInput'
import useColorScheme from '../../hooks/useColorScheme'
import { useSelector } from 'react-redux'
import { RegularText } from '../../components/StyledText'

const NameSettings = (props) => {
    const colorScheme = useColorScheme();
    const [displayName, setDisplayName] = useState(props.route.params.displayName || '');
    const [loading, setLoading] = useState(false);

    const onNextPressed = () => {
        props.navigation.navigate('SignUpBirthday', { ...props.route.params, displayName: displayName.trim() })
    }
    const onSavePress = () => {
        setLoading(true);

        db.collection("users").doc(auth.currentUser.uid).update({
            displayName
        }).then((function () {
            setLoading(false)
            props.navigation.goBack();
        }));

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
                <Header
                    navigation={props.navigation}
                    direction={'horizontal'}
                    title={'Name'}

                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="height">


                    <View style={styles.mainContainer}>

                        <RegularText darkgray style={styles.description}>{descriptions.name}</RegularText>


                        <View style={{ alignItems: 'center', paddingHorizontal: 30, marginVertical: 20 }}>
                            <Input
                                autoFocus
                                placeholder='Name'
                                value={displayName}
                                onChangeText={setDisplayName}

                            />
                        </View>



                        {props.route.params.useCase == 'sign up' &&
                            <Button
                                onPress={onNextPressed}
                                title={'Next'}
                                style={{ width: '50%', marginTop: 20 }}
                                disabled={displayName.trim().length < 2}

                            />}




                    </View>
                    {props.route.params.useCase == 'settings' &&

                        <Button
                            title='Save'
                            disabled={displayName.trim() == props.route.params.displayName || !displayName.trim() || displayName.trim().length > 15}
                            onPress={onSavePress}
                            loading={loading}
                            colors={[Colors.primary, Colors.primary]}
                            style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0 }}

                        />
                    }
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default NameSettings