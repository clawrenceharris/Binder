import { Button, Dimensions, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetHandle, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { SHADOWS } from '../constants/Theme'
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'
import { Pressable } from 'react-native'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomBottomSheet = ({ show, snapPoints, onDismiss, children, style, showsHeaderHandle }) => {
    const colorScheme = useColorScheme();
    const [backdropPressBehavior, setBackdropPressBehavior] = useState('collapse');
    const bottomSheetRef = useRef(null);
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const handlePresentPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);
    const handleTogglePressBehavior = useCallback(() => {
        setBackdropPressBehavior(state => {
            switch (state) {
                case 'none':
                    return 'close';
                case 'close':
                    return 'collapse';
                case 'collapse':
                    return 'none';
            }
        });
    }, []);

    const handleClosePress = () => {
        bottomSheetRef.current?.close();
        setTimeout(() => {
            onDismiss();
        }, 200);

    }
    useEffect(() => {
        if (show) {
            handlePresentPress();
        }
        else {
            handleClosePress();
        }


    }, [show])

    const renderBackdrop = useCallback(
        (props) => (
            <AnimatedPressable
                entering={FadeIn}
                exiting={FadeOut}
                onPress={handleClosePress}
                {...props}
                style={{ backgroundColor: '#00000080', flex: 1 }}
            />
        ),
        []
    );

    const renderHeaderHandle = useCallback(
        () => showsHeaderHandle ? <View style={styles.headerHandle} /> : null,
        []
    );


    return (

        <BottomSheetModalProvider>



            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                onDismiss={onDismiss}
                handleComponent={renderHeaderHandle}
                backdropComponent={renderBackdrop}
                style={{ ...style }}

            >
                <View style={{ height: '100%' }}>
                    {children}
                </View>

            </BottomSheetModal>


        </BottomSheetModalProvider>

    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -30,
        left: 0,
        right: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        ...SHADOWS.dark,
        height: SCREEN_HEIGHT / 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,

        zIndex: 1,
        shadowOffset: {
            width: 0,
            height: -15
        }
    },

    headerHandle: {
        width: '20%',
        marginVertical: 15,
        height: 4,
        backgroundColor: 'lightgray',
        alignSelf: 'center',
        marginHorizontal: 15,
        borderRadius: 25

    }
})
export default CustomBottomSheet