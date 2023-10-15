import {
    View,
    Animated,
    useWindowDimensions,
    StyleSheet
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import useColorScheme from '../hooks/useColorScheme';
import { Colors } from '../constants';



const DropDownNotification = ({ show }) => {
    const { width, height } = useWindowDimensions()
    const colorScheme = useColorScheme()
    const translateValue = useRef(new Animated.Value(0)).current
    const [visible, setVisible] = useState(props.show)

    const toggleModal = () => {
        if (props.show) {
            setVisible(true)
            Animated.spring(translateValue, {
                toValue: 100,
                duration: 500,
                useNativeDriver: true
            }).start()
            setTimeout(() => {
                Animated.timing(translateValue, {
                    toValue: - 100,
                    duration: 500,
                    useNativeDriver: true
                }).start()


            }, 2000)
            setTimeout(() => {
                setVisible(false)
                props.onDismiss()
            }, 3000)
        }
        else {



        }
    }


    useEffect(() => {
        toggleModal()

    }, [props.show])




    return (





        <View style={{ padding: 10, zIndex: 1, position: 'absolute', alignSelf: 'center', width: '90%' }}>


            {visible && <Animated.View style={[styles.notificationContainer, { backgroundColor: Colors[colorScheme].background, transform: [{ translateY: translateValue }], ...props.style }]} >

                {props.children}

            </Animated.View>}

        </View>

    )
}
const styles = StyleSheet.create({
    notificationContainer: {
        padding: 10,




        borderRadius: 15,
        justifyContent: 'center',
    }
})
export default DropDownNotification