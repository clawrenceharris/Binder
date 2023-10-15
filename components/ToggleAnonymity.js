import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Switch } from 'react-native-paper'
import useColorScheme from '../hooks/useColorScheme'
import { assets, Colors } from '../constants'
import ProfileButton from './ProfileButton'
import { RegularText } from './StyledText'
import { getDefaultImage } from '../utils'
import { useSelector } from 'react-redux'

const ToggleAnonymity = ({ isOn, action, style, onToggle, ...props }) => {
    const colorScheme = useColorScheme()
    const [value, setValue] = useState(isOn);
    const currentUser = useSelector(state => state.userState.currentUser);
    const [user, setUser] = useState(currentUser)
    const onValueChange = () => {
        onToggle();
        if (value == true) {
            setUser(null);
            setValue(false);
        }
        else {
            setUser(currentUser);
            setValue(true);
        }
    }
    return (

        <View style={{ width: '100%', padding: 15, backgroundColor: Colors[colorScheme].lightGray, borderRadius: 15, ...style }}>
            <RegularText h4 style={{ marginBottom: 10 }}>{action + " As:"}</RegularText>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>

                <ProfileButton
                    name={value ? user?.displayName : 'Someone'}
                    showsName
                    size={35}
                    defaultImage={assets.person_gradient.uri}
                    imageURL={isOn ? user?.photoURL : null}
                    nameStyle={{ color: value ? Colors.accent : Colors[colorScheme].veryDarkGray }}
                />
                <Switch value={value} color={Colors.accent} onValueChange={onValueChange} />
            </View>

        </View>
    )
}

export default ToggleAnonymity