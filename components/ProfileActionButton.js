import { View } from 'react-native'
import React from 'react'
import Button from './Button'
import { RegularText } from './StyledText'
import { Colors } from '../constants'
import CustomImage from './CustomImage'

const ProfileActionButton = ({ source, onPress, title, colors, size }) => {

    return (
        <View style={{ alignItems: 'center' }}>

            <Button

                onPress={onPress}
                animationEnabled={false}
                style={{ width: size || 50, height: size || 50, paddingHorizontal: 0 }}
                icon={<CustomImage source={source} style={{ width: size - 10 || 25, height: size - 10 || 25, tintColor: Colors.white }} />}
                colors={colors}
            />


            <RegularText p verydarkgray>{title}</RegularText>

        </View>
    )
}



export default ProfileActionButton