import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants'
import { SHADOWS } from '../../constants/Theme'
import { styles } from '.'
import Header from '../../components/Header'
import SelectionButton from '../../components/SelectionButton'
import { auth, db } from '../../Firebase/firebase'
import Button from '../../components/Button'
import useColorScheme from '../../hooks/useColorScheme'
import { MediumText, RegularText } from '../../components/StyledText'
import { updateUser } from '../../services/user'

const GPASetttings = (props) => {
    const colorScheme = useColorScheme()
    const gpas = ['> 4.0', '3.3 - 4.0', '2.7 - 3.3', '1.7 - 2.3', '< 1.7',]
    const [gpa, setGpa] = useState(props.route.params.gpa)
    const [loading, setLoading] = useState(false)

    const onSelect = (item) => {
        if (item === gpa) {
            return setGpa(null)
        }
        setGpa(item);
    }


    const isSelected = (item) => {
        return item === gpa
    }

    const onSavePress = () => {

        props.onTaskStart('Saving...');
        setLoading(true)
        updateUser({ gpa })
            .then(() => {
                props.onTaskComplete('Saved!')
                setLoading(false);
                props.navigation.goBack()
            })
            .catch((e) => {
                props.onTaskError(e.message);
                setLoading(false);

            })
    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header
                title={'GPA'}
                navigation={props.navigation}

            />

            <View style={styles.mainContainer}>

                <MediumText h5 style={{ marginBottom: 20, textAlign: 'center' }}>{"What is your current unweighted GPA?"}</MediumText>




                <View style={{ backgroundColor: Colors[colorScheme].background, width: '100%', borderRadius: 25, alignItems: 'center', padding: 20 }}>



                    {gpas.map((gpa, index) =>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { onSelect(gpa) }}
                            key={index}
                            style={{ padding: 20, flexDirection: 'row', marginBottom: 20, width: '50%', ...SHADOWS[colorScheme], shadowRadius: 15, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                            <RegularText h5>{gpa}</RegularText>
                            <SelectionButton
                                onSelect={() => { onSelect(gpa) }}
                                isSelected={isSelected(gpa)}

                            />

                        </TouchableOpacity>

                    )}


                </View>




            </View>

            <Button
                title='Save'
                disabled={gpa == props.route.params.gpa}
                onPress={onSavePress}
                loading={loading}
                colors={[Colors.primary, Colors.primary]}
                style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0, marginTop: 30 }}

            />
        </View>


    )
}

export default GPASetttings