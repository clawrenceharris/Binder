import { View, Text, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import Header from '../../components/Header'
import { descriptions, styles } from '.'
import Button from '../../components/Button'
import { auth, db } from '../../Firebase/firebase'
import Input from '../../components/StyledTextInput'
import useColorScheme from '../../hooks/useColorScheme'
import StyledTextInput from '../../components/StyledTextInput'
import moment from 'moment'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RegularText } from '../../components/StyledText'
import DateTimePicker from '@react-native-community/datetimepicker';
import { INVALID_BIRTHDAY } from '../../constants/ErrorMessages'
import { updateUser } from '../../services/user'

const BirthdaySettings = (props) => {
    const { birthday } = props.route.params


    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const [error, setError] = useState('')

    const [date, setDate] = useState(birthday ? new Date(birthday) : null)


    const isValidYear = (year) => {
        if (year >= 1898 && year <= 2011) {
            return true;
        }
        return false;
    }


    const onSubmit = () => {

        if (!isValidYear(date.getFullYear())) {
            return setError(INVALID_BIRTHDAY);
        }
        props.onTaskStart('Saving...')
        setLoading(true);
        updateUser({ birthday: date.getTime() })
            .then(() => {
                setLoading(false);
                props.navigation.goBack();
                props.onTaskComplete('Saved!')
            })
            .catch((e) => {
                setLoading(false);
                props.onTaskError(getErrorMessage(e));
            })

    }
    const onChange = (event, selectedDate) => {
        setError('')
        if (event.type === 'neutralButtonPressed') {
            setDate(new Date(0));
        } else {
            setDate(selectedDate);
        }
    };

    return (
        <>
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background, paddingHorizontal: 15 }}>
                <Header
                    title='Birthday'

                />
                <View style={styles.mainContainer}>
                    <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.birthday}</RegularText>

                    <StyledTextInput
                        error={error}

                        isClearable
                        placeholder='Birthday'
                        keyboardType={'number-pad'}
                        onChangeText={(value) => { setDate(value); setError('') }}
                        value={date && moment(date).format('MMMM DD, YYYY')}
                        editable={false}
                        icon={<Text>🎂</Text>}

                    />


                </View>
                <RegularText style={{ color: Colors.red }}>{error}</RegularText>

                <View style={{ width: '100%', bottom: 80, position: 'absolute' }}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        display='spinner'
                        maximumDate={new Date((new Date().getFullYear() + 1).toString())}
                        minimumDate={new Date('1920')}
                        value={date || new Date()}
                        textColor={Colors[colorScheme].tint}
                        accentColor={Colors.accent}
                        onChange={onChange}

                    />
                </View>
            </View>
            <Button
                title={'Save'}
                onPress={onSubmit}
                colors={[Colors.primary, Colors.primary]}
                style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0 }}
                disabled={!date || date?.getTime() == birthday}
                loading={loading}
            />
        </>
    )
}

export default BirthdaySettings