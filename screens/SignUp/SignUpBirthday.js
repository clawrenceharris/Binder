import { View, Text } from 'react-native'
import React, { useState } from 'react'
import useColorScheme from '../../hooks/useColorScheme'
import { Colors } from '../../constants'
import { descriptions, styles } from '.'
import Button from '../../components/Button'
import Header from '../../components/Header'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import StyledTextInput from '../../components/StyledTextInput'
import { MediumText, RegularText } from '../../components/StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INVALID_BIRTHDAY } from '../../constants/ErrorMessages'
const SignUpBirthday = (props) => {

    const [date, setDate] = useState(null)
    const [error, setError] = useState('')
    const colorScheme = useColorScheme()
    const insets = useSafeAreaInsets();
    const onNextPressed = () => {

        if (isValidYear(date.getFullYear())) {
            props.navigation.navigate('SignUpUsername', { ...props.route.params, birthday: date.getTime() });

        }
        else {
            setError(INVALID_BIRTHDAY);
        }
    }


    const isValidYear = (year) => {
        if (year >= 1898 && year <= 2011) {
            return true
        }
        return false
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
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header color={Colors.accent} />
            <View style={{ paddingHorizontal: 15 }}>
                <MediumText h3 style={{ marginBottom: 10, textAlign: 'center' }}>{" When's your birthday?"}</MediumText>
                <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.birthday}</RegularText>
                <StyledTextInput
                    error={error}

                    isClearable
                    placeholder='Birthday'
                    keyboardType={'number-pad'}
                    onChangeText={(value) => { setDate(value); setError('') }}
                    value={date ? moment(date).format('MMMM DD, YYYY') : ''}
                    editable={false}
                    icon={<Text>🎂</Text>}

                />
                <RegularText style={styles.errorMessage}>{error}</RegularText>
                <Button
                    title={'Next'}
                    onPress={onNextPressed}
                    style={{ marginTop: 20, paddingHorizontal: 40, }}
                    disabled={!date}
                />
            </View>
            <View style={{ bottom: insets.bottom, position: 'absolute', width: '100%' }}>
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
    )
}



export default SignUpBirthday

