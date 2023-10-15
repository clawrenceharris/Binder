import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { LightText, RegularText } from './StyledText'
import Button from './Button'
import useColorScheme from '../hooks/useColorScheme'
import { assets, Colors } from '../constants'
import { useNavigation } from '@react-navigation/native'
import CustomImage from './CustomImage'

const ProfileItemsButton = ({ items, subtitle, title, source, onPress, isBottom, isTop, colors, disabled, canNavigate, useCase, iconStyle }) => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const getUseCase = () => {
        switch (title) {
            case "Popular Messages":
            case "Burning Questions": return 'burning questions'
            case "Desk Items": return 'desk items';

            case "Pinned Messages": return "messages";
            case "Media": return "media";
            case "Shared Chats": return "chats";
            case "Members": return "members"
            default: return "users"


        }
    }
    const handlePress = () => {

        if (!disabled) {
            if (onPress) {
                return onPress();
            }
            else {
                navigation.push('Items', { title, items, canNavigate, useCase: useCase || getUseCase() })
            }
        }

    }
    return (
        <View style={{
            backgroundColor: Colors[colorScheme].darkGray,
            borderTopLeftRadius: isTop && 15,
            borderTopRightRadius: isTop && 15,
            borderBottomRightRadius: isBottom && 15,
            borderBottomLeftRadius: isBottom && 15

        }}>


            <TouchableOpacity
                activeOpacity={0.8}
                disabled={disabled}
                style={[styles.itemsContainer, {
                    backgroundColor: Colors[colorScheme].invertedTint,
                    borderTopLeftRadius: isTop && 15,
                    borderTopRightRadius: isTop && 15,
                    borderBottomRightRadius: isBottom && 15,
                    borderBottomLeftRadius: isBottom && 15,
                    borderBottomWidth: !isBottom && 1,
                    borderBottomColor: '#EAEBF1'
                }]}
                onPress={handlePress}>




                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                    <Button
                        onPress={handlePress}
                        animationEnabled={false}
                        style={{ paddingHorizontal: 0, width: 50, height: 50 }}
                        icon={<CustomImage source={source} style={{ width: 35, height: 35, tintColor: Colors.white, ...iconStyle }} />}
                        colors={colors}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <RegularText h4 tint >{title}</RegularText>
                        <LightText h5 style={{ color: Colors.light.darkGray }} >{subtitle}</LightText>
                    </View>
                </View>

                <CustomImage source={assets.right_arrow} style={{ width: 25, height: 25, tintColor: Colors.light.darkGray }} />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    itemsContainer: {
        justifyContent: 'space-between',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
})
export default ProfileItemsButton