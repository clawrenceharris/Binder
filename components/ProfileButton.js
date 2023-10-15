import { View, TouchableOpacity, Animated, Image, Text } from 'react-native'
import React, { useRef } from 'react'
import { StyleSheet } from 'react-native'
import { Colors } from '../constants';
import useColorScheme from '../hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { BoldText, MediumText, RegularText } from './StyledText';
import ScaleButton from './ScaleButton';
import CustomImage from './CustomImage';
import { SHADOWS } from '../constants/Theme';


const BUTTON_SIZE = 50
const ProfileButton = ({
    disabled,
    onPress,
    imageURL,
    badge,
    onLongPress,
    emoji,
    defaultImage,
    imageStyle,
    defaultImageStyle,
    buttonStyle,
    style,
    imageContainerStyle,
    badgeContainerStyle,
    name,
    showsName,
    nameStyle,
    colors,
    emojiStyle,
    children,
    size,
    animationEnabled,
}) => {
    const animationDuration = 150
    const colorScheme = useColorScheme()
    const buttonSize = size || BUTTON_SIZE

    const handlePress = () => {
        if (!disabled && onPress) {
            if (animationEnabled == true || animationEnabled == null)
                setTimeout(onPress, animationDuration)
            else
                onPress()
        }

    }


    return (




        <View style={
            { flexDirection: 'row', alignItems: 'center', ...style }

        }>

            <ScaleButton
                animationEnabled={(animationEnabled == true || animationEnabled == null) && !disabled}
                toValue={0.8}
                onLongPress={onLongPress}
                onPress={handlePress}>



                <View style={[styles.buttonContainer, {
                    borderRadius: buttonSize / 2,
                    backgroundColor: colorScheme === 'light' ? Colors.light.gray : Colors.light.tint,
                    width: buttonSize, height: buttonSize,
                    ...buttonStyle
                }]}>


                    <LinearGradient
                        colors={colors || ['#DFE7FA', '#E5E1F8']}
                        style={[styles.imageContainer, { borderRadius: buttonSize / 2, width: buttonSize, height: buttonSize, ...imageContainerStyle }]}>
                        {
                            imageURL != null &&

                            <CustomImage
                                source={{ uri: imageURL }}
                                style={[styles.image, { width: buttonSize, height: buttonSize, ...imageStyle }]} />}

                        {defaultImage?.length && !imageURL && !emoji &&
                            <CustomImage
                                source={{ uri: defaultImage }}
                                style={[styles.defaultImage, { width: buttonSize * 0.6, height: buttonSize * 0.6, ...defaultImageStyle, }]} />


                        }
                        {emoji &&
                            <Text
                                style={{ fontSize: buttonSize / 2, ...emojiStyle, }}>
                                {emoji}
                            </Text>



                        }



                    </LinearGradient>


                    {badge && <View style={[
                        styles.badgeContainer, {
                            backgroundColor: Colors[colorScheme].background,
                            width: buttonSize / 1.8,
                            height: buttonSize / 1.8,
                            top: buttonSize - 20,
                            left: buttonSize - 20,
                            ...badgeContainerStyle,
                        }]}>


                        {badge}


                    </View>}
                </View>
            </ScaleButton>
            {
                showsName &&
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.8}

                >



                    <RegularText h5 tint

                        style={{ marginLeft: 10, ...nameStyle }}>
                        {name}
                    </RegularText>

                </TouchableOpacity>

            }
            {children}

        </View>

    )
}


const styles = StyleSheet.create({

    buttonContainer: {


        justifyContent: 'center',
        alignItems: 'center',


    },

    defaultImage: {
        resizeMode: 'cover',


    },

    image: {
        resizeMode: 'cover',

    },

    imageContainer: {
        borderRadius: 100,
        backgroundColor: '#00000020',
        alignItems: 'center',
        overflow: 'hidden',
        justifyContent: 'center',


    },

    badgeContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        borderRadius: 50,

        position: 'absolute',
        padding: 3

    }



})
export default ProfileButton