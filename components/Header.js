import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    SafeAreaView
} from 'react-native'
import React from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { MediumText } from './StyledText'
import { SIZES } from '../constants/Theme'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomImage from './CustomImage'


const Header = ({
    headerLeft,
    headerCenter,
    headerRight,
    title,
    color,
    isModal,
    border,
    onBackPress,
    textStyle,
    backButton,
    direction,
    headerCenterStyle,
    headerLeftStyle,
    headerRightStyle,
    style }) => {


    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (

        <SafeAreaView style={[styles.mainContainer, {
            height: isModal ? 80 : SIZES.header + insets.top,
            borderTopLeftRadius: direction === 'vertical' ? 15 : 0,
            borderTopRightRadius: direction === 'vertical' ? 15 : 0,
            borderBottomWidth: border ? 0.3 : 0,
            borderBottomColor: Colors[colorScheme].gray,
            ...style
        }]}>

            <TouchableWithoutFeedback
                onPress={() => { onBackPress ? onBackPress() : navigation.goBack() }}>



                <View style={[styles.headerLeft, { ...headerLeftStyle }]}>


                    {headerLeft ||


                        <View style={{ zIndex: 1 }}>
                            {direction === 'vertical' ?
                                <CustomImage
                                    source={backButton || assets.left_arrow}
                                    style={{ width: 22, height: 22, tintColor: color || Colors[colorScheme].tint, transform: [{ rotate: '-90deg' }] }}
                                />

                                :

                                <CustomImage
                                    source={backButton || assets.left_arrow}
                                    style={{ width: 22, height: 22, tintColor: color || Colors[colorScheme].tint }}
                                />

                            }
                        </View>

                    }
                </View>
            </TouchableWithoutFeedback>




            <View style={[styles.headerCenter, { ...headerCenterStyle }]}>


                {headerCenter ||
                    <View>

                        <MediumText h3 style={[styles.title, { color: color || Colors[colorScheme].tint, ...textStyle }]}>{title}</MediumText>

                    </View>


                }
            </View>




            <View style={[styles.headerRight, { ...headerRightStyle }]}>

                {headerRight}

            </View>

        </SafeAreaView>

    )
}


const styles = StyleSheet.create({


    title: {
        textAlign: 'center',

    },
    headerLeft: {
        width: 40,
        height: 40,
        justifyContent: 'center'
    },
    headerRight: {
        width: 40,
        height: 40,
        justifyContent: 'center'

    },
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 15





    },
    headerCenter: {
        flex: 1,





    }
})
export default Header