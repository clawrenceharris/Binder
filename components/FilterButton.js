import { Image, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { MediumText } from './StyledText'
import { LinearGradient } from 'expo-linear-gradient'
import ProfileButton from './ProfileButton'
import { haptics } from '../utils'
import { Dropdown } from 'react-native-element-dropdown'




const FilterButton = ({ item, isSelected, onPress, style, otherItem }) => {
    const colorScheme = useColorScheme()
    const more = item?.more || []
    const ref = useRef(null)
    const data = more.map(item => (
        { label: item?.text, value: item }
    ))

    const handlePress = (item) => {
        if (more.length == 0) {
            haptics('light')
            onPress(item)
        }


    }


    return (



        <TouchableWithoutFeedback
            onPress={() => handlePress(item)}>

            <View>



                <LinearGradient
                    end={{ x: 1, y: 1 }}
                    colors={isSelected ? [Colors.accent, Colors.purple] : ['transparent']}
                    style={{
                        flexDirection: 'row',

                        paddingHorizontal: 3,
                        borderColor: !isSelected ? Colors.accent : 'transparent',
                        borderWidth: 1,
                        height: 40,

                        alignItems: 'center',
                        marginRight: 10,
                        borderRadius: 50,
                        ...style


                    }}>

                    <ProfileButton
                        imageURL={item.imageURL}
                        size={32}
                        defaultImage={item.icon}
                        emoji={item.emoji}
                        colors={item?.colors}
                        containerStyle={{ position: 'absolute' }}
                        onPress={() => handlePress(item)}
                        animationEnabled={false}
                    />



                    <MediumText
                        numberOfLines={1}
                        style={{ marginLeft: 5, color: isSelected ? 'white' : Colors.accent }}>
                        {otherItem?.text || item?.text}
                    </MediumText>


                    {more.length > 0 &&
                        <TouchableOpacity onPress={() => { ref.current?.open() }}>

                            <Image source={assets.left_arrow} style={{ tintColor: isSelected ? Colors.white : Colors.accent, marginLeft: 10, width: 12, height: 12, transform: [{ rotate: '-90deg' }] }} />
                        </TouchableOpacity>
                    }

                </LinearGradient>

            </View>
        </TouchableWithoutFeedback>




    )

}

export default FilterButton