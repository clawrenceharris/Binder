import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SHADOWS } from '../../constants/Theme'
import { styles } from '.'
import Header from '../../components/Header'
import SelectionButton from '../../components/SelectionButton'
import { Colors } from '../../constants'
import Button from '../../components/Button'
import { auth, db } from '../../Firebase/firebase'
import useColorScheme from '../../hooks/useColorScheme'
import { MediumText, RegularText } from '../../components/StyledText'
import { updateUser } from '../../services/user'

const GraduationYearSettings = (props) => {
    const year = new Date().getFullYear();
    const years = [year, year + 1, year + 2, year + 3, "Other"]
    const [selectedYear, setSelectedYear] = useState(null)
    const colorScheme = useColorScheme()
    const [loading, setLoading] = useState(false)



    const onSelect = (year) => {

        if (selectedYear === year) {
            return setSelectedYear(null)
        }
        setSelectedYear(year);
    }

    const onSavePress = () => {
        props.onTaskStart('Saving...');
        setLoading(true)
        updateUser({ gradYear: selectedYear })
            .then(() => {
                props.onTaskComplete('Saved!');
                setLoading(false);
                props.navigation.goBack();
            })
            .catch((e) => {
                setLoading(false);
                props.onTaskError(e.message);
            })
    }

    const isSelected = (year) => {
        return year === selectedYear
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header
                title={'Class Year'}
                navigation={props.navigation}

            />
            <View style={[styles.mainContainer, { padding: 20 }]} >

                <MediumText h4 style={{ marginBottom: 10 }}>{"When do you expect graduate?"}</MediumText>



                <View style={{ backgroundColor: Colors[colorScheme].background, width: '100%', borderRadius: 25, alignItems: 'center', padding: 20 }}>


                    {years.map((year, index) =>
                        <TouchableOpacity
                            onPress={() => { onSelect(year) }}
                            key={index.toString()}
                            activeOpacity={0.8}
                            style={{ flexDirection: 'row', marginBottom: 22, padding: 20, width: '50%', backgroundColor: '#fff', ...SHADOWS[colorScheme], shadowRadius: 15, borderRadius: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                            <RegularText h5>{year}</RegularText>
                            <SelectionButton
                                onSelect={() => { onSelect(year) }}
                                isSelected={isSelected(year)}
                                activeOpacity={1}

                            />

                        </TouchableOpacity>
                    )}
                </View>
                <RegularText darkgray style={styles.description}>{"We'll use this to match you with study buddies."}</RegularText>



            </View>

            <Button
                title='Save'
                onPress={onSavePress}
                loading={loading}
                colors={[Colors.primary, Colors.primary]}
                style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0, marginTop: 30 }}

            />

        </View>
    )
}

export default GraduationYearSettings