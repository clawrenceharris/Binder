import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import { ConfirmationModal } from '../components/Modals'
import StyledTextInput from '../components/StyledTextInput'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Button from '../components/Button'
import { RegularText } from '../components/StyledText'
import SlideModal from '../components/SlideModal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const MAX_LENGTH = 255
const NewBurningQuestion = (props) => {
    const { useCase } = props.route.params;
    const bq = props.route.params?.bq;
    const [question, setQuestion] = useState(bq?.question || '');
    const colorScheme = useColorScheme();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [subject, setSubject] = useState(bq?.subject || '');
    const insets = useSafeAreaInsets();
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

                <Header
                    onBackPress={() => {
                        if ((subject.length || question.length) && (bq?.question + bq?.subject != question + subject)) {
                            setShowConfirmationModal(true)
                        } else {
                            props.navigation.goBack()
                        }
                    }}
                    title={useCase == 'edit' ? 'Edit Burning Question' : 'New Burning Question'}
                />

                <SlideModal
                    toValue={0.5}
                    onCancel={() => setShowConfirmationModal(false)}
                    showModal={showConfirmationModal}>


                    <ConfirmationModal
                        confirmText={"Discard"}
                        message='Discard your Burning Question?'
                        onConfirmPress={() => props.navigation.goBack()

                        }
                        onCancelPress={() => setShowConfirmationModal(false)} />
                </SlideModal>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">


                    <View style={{ padding: 15 }}>





                        <StyledTextInput
                            containerStyle={{ marginVertical: 20 }}
                            placeholder="Subject"
                            onChangeText={setSubject}
                            value={subject}
                            autoFocus
                            isClearable

                        />



                        <StyledTextInput

                            multiline
                            placeholder="Type your question..."
                            style={{ height: 200, }}
                            containerStyle={{ borderRadius: 15, marginBottom: 20 }}
                            onChangeText={setQuestion}
                            value={question}
                            isClearable

                        />

                        <RegularText style={{ margin: 5, color: question.length <= MAX_LENGTH ? Colors[colorScheme].veryDarkGray : Colors.red }}>{question.length + '/' + MAX_LENGTH}</RegularText>










                    </View>

                    <Button
                        disabled={!subject || !question || question.length > MAX_LENGTH}
                        style={{ position: 'absolute', bottom: insets.bottom, paddingHorizontal: 50 }}
                        title='Next'
                        onPress={() => props.navigation.navigate('NewBurningQuestionB', { subject, question, ...props.route.params })}



                    />
                </KeyboardAvoidingView>
            </View >
        </TouchableWithoutFeedback>
    )
}

export default NewBurningQuestion