import { View, Text, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Button from '../components/Button'
import StyledTextInput from '../components/StyledTextInput'
import { RegularText } from '../components/StyledText'
import Header from '../components/Header'
import { db } from '../Firebase/firebase'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SendReport = (props) => {
    const colorScheme = useColorScheme();
    const { useCase, title, data } = props.route.params;
    const [message, setMessage] = useState('');
    const user = useSelector(state => state.userState.currentUser);
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const getPlaceholder = () => {
        if (useCase == 'report bug') {
            return "Describe in detail the bug you're facing..."
        }
        else if (useCase == 'report') {
            return "Explain in detail the reason for this report..."
        }
        else if (useCase == 'help') {
            return "Tell us what you need help with..."
        }
        else if (useCase == 'suggestion') {
            return 'Tell us your ideas...'
        }
    }


    const onSubmitPress = () => {
        props.onTaskStart('Submitting...');
        setLoading(true);
        db.collection('reports')
            .add({
                reportData: data || null,
                message,
                reporter: { uid: user.uid, name: user.displayName },
                type: useCase


            })
            .then(() => {
                setLoading(false);
                props.onTaskComplete('Submitted!');
                if (useCase == 'report bug') {
                    props.navigation.pop(2);
                }
                else
                    props.navigation.goBack();


            })
            .catch((e) => {
                props.onTaskError(e.message);
                setLoading(false);
            })
    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

            <Header

                title={title}
            />

            <KeyboardAvoidingView style={{ flex: 1 }} behavior='height'>


                <View style={{ padding: 20 }}>




                    <StyledTextInput
                        multiline
                        placeholder={getPlaceholder()}
                        style={{ height: 200, }}
                        containerStyle={{ borderRadius: 15 }}
                        onChangeText={setMessage}
                        value={message}
                        isClearable

                    />


                </View>

                <Button
                    style={{ position: 'absolute', bottom: insets.bottom }}
                    title='Submit'
                    onPress={onSubmitPress}
                    loading={loading}
                />
            </KeyboardAvoidingView>

        </View >
    )
}

export default SendReport