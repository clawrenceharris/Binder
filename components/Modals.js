import { ActivityIndicator, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { Colors, assets } from "../constants"
import useColorScheme from "../hooks/useColorScheme"
import CustomText from "./CustomText";
import { MediumText, RegularText } from "./StyledText";
import { useState } from "react";


export const ConfirmationModal = (

    {
        message,
        cancelText,
        confirmText,
        loading,
        onConfirmPress,
        onCancelPress,
        highlightedColor,
        title,
        slides
    }
) => {
    const colorScheme = useColorScheme();
    const [currentSlide, setCurrentSlide] = useState(0);
    return (
        <View style={{ padding: 15, width: '80%', alignSelf: 'center', alignItems: 'center', backgroundColor: Colors[colorScheme].invertedTint, borderRadius: 20 }} >
            {slides?.length &&

                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 20 }}>

                    <View style={{ width: 30 }}>



                        {currentSlide > 0 ?
                            <TouchableWithoutFeedback onPress={() => setCurrentSlide(currentSlide - 1)}>

                                <Image source={assets.left_arrow} style={{ width: 18, height: 18, tintColor: Colors[colorScheme].veryDarkGray }} />
                            </TouchableWithoutFeedback>

                            :
                            <TouchableWithoutFeedback onPress={slides?.length ? slides[currentSlide].onCancelPress : onCancelPress}>
                                <Image source={assets.close} style={{ width: 18, height: 18, tintColor: Colors[colorScheme].veryDarkGray }} />
                            </TouchableWithoutFeedback>
                        }

                    </View>

                    {slides?.length ?
                        <View style={{ flex: 1 }}>

                            <RegularText h4 style={{ textAlign: 'center', }}>

                                {slides[currentSlide].title}


                            </RegularText>
                        </View>
                        :
                        <RegularText darkgray h5 style={{ flex: 1, textAlign: 'center', }}>

                            {title}
                        </RegularText>
                    }

                    <View style={{ width: 30 }} />

                </View>}

            {slides?.length ?
                < RegularText h5 darkgray style={{ textAlign: 'center', }}>
                    {slides[currentSlide].message}
                </RegularText>
                :
                < RegularText h5 darkgray style={{ textAlign: 'center', }}>
                    {message}
                </RegularText>


            }

            <View style={{ marginTop: 25 }}>


                {loading || (slides && slides[currentSlide].loading) ?
                    <View style={{ width: '50%', alignItems: 'center' }}>
                        < ActivityIndicator size='small' color={Colors.accent} />

                    </View>
                    :
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ borderRadius: 25, backgroundColor: Colors[colorScheme].darkGray, padding: 8, paddingHorizontal: 40 }}
                        onPress={() => {

                            if (slides?.length) {
                                const slide = slides[currentSlide];
                                slide?.onConfirmPress && slide.onConfirmPress();
                                if (currentSlide < slides.length - 1)
                                    setCurrentSlide(currentSlide + 1);
                            }
                            else {
                                onConfirmPress();
                            }
                        }
                        }>
                        {slides?.length ?
                            < MediumText white h4 style={{ textAlign: 'center' }}>
                                {slides[currentSlide].confirmText || "Confirm"}
                            </MediumText>
                            :
                            < MediumText white h4 style={{ textAlign: 'center' }}>
                                {confirmText || "Confirm"}
                            </MediumText>


                        }
                    </TouchableOpacity>

                }
                <TouchableOpacity
                    activeOpacity={1}

                    style={{ marginTop: 30 }}
                    onPress={onCancelPress}>
                    {slides?.length ?
                        < MediumText darkgray h4 style={{ textAlign: 'center', }}>
                            {slides[currentSlide].cancelText || "Cancel"}
                        </MediumText>
                        :
                        < MediumText darkgray h4 style={{ textAlign: 'center', }}>
                            {cancelText || "Cancel"}
                        </MediumText>


                    }
                </TouchableOpacity>

            </View>

        </View>
    )
}

export const SubmitModal = (
    { children,
        loading,
        cancelText,
        submitText,
        title,
        subtitle,
        onSubmitPress,
        onCancelPress,
        highlightedColor }) => {
    const colorScheme = useColorScheme()
    return (
        <View style={{ alignItems: 'center', backgroundColor: Colors[colorScheme].background, borderRadius: 20, padding: 20 }}>
            <View style={{ borderBottomWidth: 2, borderBottomColor: Colors[colorScheme].tint, paddingBottom: 5 }}>
                <RegularText h4>{title || ""}</RegularText>

            </View>

            <RegularText darkgray style={{ textAlign: 'center', marginVertical: 20 }}>{subtitle || ""}</RegularText>


            {children}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>

                <TouchableOpacity


                    style={{ paddingHorizontal: 20, width: '50%', alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors[colorScheme].gray }}
                    onPress={onCancelPress}>
                    <RegularText style={{ marginTop: 5, fontSize: 16 }}>{cancelText || "Cancel"}</RegularText>
                </TouchableOpacity>

                {loading ?
                    <View style={{ width: '50%', alignItems: 'center' }}>
                        < ActivityIndicator size='small' color={Colors.accent} />

                    </View>
                    :
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '50%', alignItems: 'center' }}
                        onPress={onSubmitPress}>
                        <MediumText accent h4 style={{ paddingHorizontal: 20, marginTop: 5 }}>{submitText || "Done 👍"}</MediumText>
                    </TouchableOpacity>


                }
            </View>
        </View>
    )
}