import { View, Animated, Modal, useWindowDimensions, TouchableWithoutFeedback, StyleSheet, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import useColorScheme from '../hooks/useColorScheme';
import { Colors } from '../constants';
import { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SlideModal = ({ showModal, height, children, toValue, onCancel, modalBackgroundStyle, style, containerStyle }) => {
    const translateValue = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(showModal);

    const insets = useSafeAreaInsets();
    const toggleModal = () => {
        if (showModal) {
            setVisible(true)
            Animated.spring(translateValue, {
                toValue: toValue || 0,
                duration: 100,
                useNativeDriver: true
            }).start()
        }
        else {

            setTimeout(() => setVisible(false), 400)

            Animated.timing(translateValue, {
                toValue: -1,
                duration: 100,
                useNativeDriver: true
            }).start()
        }
    }


    useEffect(() => {
        toggleModal()

    }, [showModal])




    return (

        <Modal
            style={style}
            transparent
            animationType='fade'
            visible={visible}
        >
            <TouchableWithoutFeedback onPress={onCancel}>


                <View style={[styles.modalBackground, { ...modalBackgroundStyle }]} >



                    <Animated.View style={[styles.container, {
                        transform: [{
                            translateY: translateValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [(height || 500) - insets.bottom, 0]
                            })
                        }], ...containerStyle
                    }]} >

                        {children}

                    </Animated.View>
                </View>

            </TouchableWithoutFeedback>
        </Modal >


    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: '#00000010',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        borderRadius: 15,

        justifyContent: 'center',


    }
})
export default SlideModal