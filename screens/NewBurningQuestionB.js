import { View, KeyboardAvoidingView, TouchableOpacity, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import StyledTextInput from '../components/StyledTextInput'
import ToggleAnonymity from '../components/ToggleAnonymity'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { getErrorMessage, getItemLayout } from '../utils'
import Button from '../components/Button'
import { useSelector } from 'react-redux'
import { auth } from '../Firebase/firebase'
import { RegularText } from '../components/StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { addBurningQuestion, updateBurningQuestion } from '../services/burningQuestions'
import CustomImage from '../components/CustomImage'


const NewBurningQuestionB = (props) => {
    const bq = props.route.params?.bq;
    const { onSubmit, useCase, subject, question } = props.route.params;
    const insets = useSafeAreaInsets();
    const [tags, setTags] = useState(bq?.tags || [])
    const [tag, setTag] = useState('')
    const colorScheme = useColorScheme()
    const [isAnonymous, setIsAnonymous] = useState(bq?.isAnonymous || false);
    const [loading, setLoading] = useState(false);
    const onToggle = () => setIsAnonymous(!isAnonymous);
    const data = {

        isAnonymous,
        subject,
        question,
        tags,
        uid: auth.currentUser.uid,
    };
    const handleSave = () => {
        props.onTaskStart('Saving...')
        setLoading(true);
        if (useCase == 'edit') {
            updateBurningQuestion(bq.id, data)
                .then(() => {
                    setLoading(false);
                    props.onTaskComplete('Saved!');
                    onSubmit({ id: bq.id, ...data });
                    props.navigation.pop(2);
                })
                .catch((e) => {
                    props.onTaskError(getErrorMessage(e));
                    setLoading(false);
                    props.navigation.pop(2);
                })
        }
        else if (useCase == 'new') {
            addBurningQuestion(data)
                .then((id) => {
                    setLoading(false);
                    props.onTaskComplete('Saved!');
                    onSubmit({ id, ...data });
                    props.navigation.pop(2);
                })
                .catch((e) => {
                    props.onTaskError(getErrorMessage(e));
                    setLoading(false);
                    props.navigation.pop(2);
                })
        }

    }
    const onDonePress = () => {

        props.navigation.pop(2)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

                <Header
                    title={useCase == 'edit' ? 'Edit Burning Question' : 'New Burning Question'}
                />

                <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">



                    <View style={{ padding: 20 }}>


                        <ToggleAnonymity
                            action={"Save"}
                            style={{ marginBottom: 20 }}
                            isOn={!isAnonymous}
                            onToggle={onToggle} />

                        <StyledTextInput

                            placeholder="Add tags"
                            isClearable
                            onSubmitEditing={() => {
                                if (tag && tags.length <= 8 && !tags.includes(tag)) {
                                    setTag('');
                                    setTags([...tags, tag])
                                }
                            }}
                            style={{ paddingLeft: 40 }}
                            onChangeText={setTag}
                            value={tag}
                            autoFocus
                            icon={

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={!tag || tags.length > 8 || tags.includes(tag)}
                                    onPress={() => { setTag(''); setTags([...tags, tag]) }}
                                    style={{ padding: 6, backgroundColor: Colors.primary, borderRadius: 25 }}>
                                    <CustomImage source={assets.add} style={{ width: 15, height: 15, tintColor: Colors.white }} />
                                </TouchableOpacity>
                            }



                        />
                        <View style={{ height: 100 }}>


                            <FlatList
                                data={tags}
                                keyExtractor={item => item}
                                showsHorizontalScrollIndicator={false}
                                getItemLayout={getItemLayout}
                                numColumns={3}
                                renderItem={({ item }) =>
                                    <View style={{ maxWidth: 120, marginRight: 5, marginTop: 10, backgroundColor: Colors.primary, paddingHorizontal: 10, padding: 4, borderRadius: 25, flexDirection: 'row', alignItems: 'center' }}>
                                        <RegularText white numberOfLines={1} style={{ maxWidth: '80%', marginRight: 20 }}>{item}</RegularText>

                                        <TouchableOpacity onPress={() => setTags(tags.filter(tag => tag != item))} style={{ position: 'absolute', right: 5, backgroundColor: Colors[colorScheme].background, padding: 5, borderRadius: 50 }}>

                                            <CustomImage source={assets.close} style={{ tintColor: Colors[colorScheme].darkGray, width: 10, height: 10 }} />


                                        </TouchableOpacity>
                                    </View>

                                }
                            />
                        </View>


                    </View>


                    <Button
                        title={'Save'}
                        loading={loading}
                        colors={[Colors.primary, Colors.primary]}
                        disabled={
                            bq &&
                            bq.subject == subject &&
                            bq.question == question &&
                            bq.tags == tags &&
                            bq.isAnonymous == isAnonymous
                        }
                        onPress={handleSave}
                        style={{ position: 'absolute', bottom: 0, width: '100%', borderRadius: 0, height: 80 }}

                    />

                </KeyboardAvoidingView>

            </View >
        </TouchableWithoutFeedback>
    )
}

export default NewBurningQuestionB