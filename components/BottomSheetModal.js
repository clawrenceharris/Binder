import { View, Animated, Modal, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import useColorScheme from '../hooks/useColorScheme';
import CustomBottomSheet from './CustomBottomSheet';

// interface Props {
//     showModal: boolean
//     snapPoints: (string | number)[]


// }
const BottomSheetModal = (props) => {
    const { width, height } = useWindowDimensions()
    const colorScheme = useColorScheme()
    const translateValue = useRef(new Animated.Value(0)).current
    const [visible, setVisible] = useState(props.showModal)
    const fall = new Animated.Value(1)

    const toggleModal = () => {
        if (props.showModal) {
            setVisible(true)

        }
        else {

            setVisible(false)


        }
    }

    useEffect(() => {
        toggleModal()

    }, [props.showModal])




    return (
        <Modal
            transparent
            visible={props.showModal}
        >
            <View style={{ flex: 1, backgroundColor: '#00000020' }}>


                <CustomBottomSheet
                    snapPoints={props.snapPoints}
                    onClose={props.onClose}
                    show={visible}
                    renderContent={props.renderContent}
                />


            </View>



        </Modal >

    )
}

export default BottomSheetModal