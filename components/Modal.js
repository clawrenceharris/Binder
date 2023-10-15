import {
    View,
    Modal,
    Animated
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'

const ModalComponent = (props) => {
    const colorScheme = useColorScheme()
    const translateValue = useRef(new Animated.Value(0)).current

    const [showModal, setshowModal] = useState(props.visible)





    function slideIn() {
        Animated.timing(
            translateValue,
            {

                toValue: props.position == 'bottom' ? -1 * (props.height * 2) : props.toValue,
                duration: 500,
                useNativeDriver: true,

            }).start();
    }


    function slideOut() {
        Animated.timing(
            translateValue,
            {

                toValue: 900,
                duration: 300,
                useNativeDriver: true,

            }).start();
    }



    return (
        <Modal
            transparent
            animationType='slide'
            visible={props.showModal}

        >

            <View style={{ backgroundColor: '#00000085', flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <View style={{ borderColor: 'gray', borderWidth: 1, alignSelf: 'center', height: props.height, backgroundColor: Colors[colorScheme].background, width: props.width || 300, borderRadius: 25, padding: 20 }}>




                    {props.children}
                </View>

            </View>


        </Modal>
    )
}

export default ModalComponent