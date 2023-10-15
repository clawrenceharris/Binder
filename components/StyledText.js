import { Text, useColorScheme, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants"

export const MediumText = ({
    h1, h2, h3, h4, h5, p = true,
    tint = true, gray, darkgray, verydarkgray,
    white, accent, primary,
    children,
    style,
    color,
    ...rest }) => {
    const colorScheme = useColorScheme()
    return (


        <Text style={[
            {
                fontFamily: 'Avenir Next',
                color,
                fontWeight: '600'
            },
            tint && { color: Colors[colorScheme].tint },
            gray && { color: Colors[colorScheme].gray },
            darkgray && { color: Colors[colorScheme].darkGray },
            verydarkgray && { color: Colors[colorScheme].veryDarkGray },
            white && { color: Colors.white },
            accent && { color: Colors.accent },
            primary && { color: Colors.primary },
            p && { fontSize: 14 },
            h2 && { fontSize: 28 },
            h1 && { fontSize: 36 },
            h3 && { fontSize: 20 },
            h4 && { fontSize: 18 },
            h5 && { fontSize: 16 },

            style
        ]} {...rest}>
            {children}
        </Text>


    )
}

export const RegularText = ({
    h1, h2, h3, h4, h5, p = true,
    tint = true, gray, darkgray, verydarkgray,
    white, accent, primary,
    children,
    style,
    color,
    ...rest }) => {
    const colorScheme = useColorScheme()

    return (


        <Text

            style={[
                {
                    fontFamily: 'Avenir Next',
                    fontWeight: '500'

                },

                tint && { color: Colors[colorScheme].tint },
                gray && { color: Colors[colorScheme].gray },
                darkgray && { color: Colors[colorScheme].darkGray },
                verydarkgray && { color: Colors[colorScheme].veryDarkGray },
                white && { color: Colors.white },
                accent && { color: Colors.accent },
                primary && { color: Colors.primary },
                p && { fontSize: 14 },
                h1 && { fontSize: 36 },
                h2 && { fontSize: 28 },
                h3 && { fontSize: 20 },
                h4 && { fontSize: 18 },
                h5 && { fontSize: 16 },

                style
            ]} {...rest}>
            {children}

        </Text>


    )
}


export const LightText = ({
    h1, h2, h3, h4, h5, p = true,
    tint = true, gray, darkgray, verydarkgray,
    white, accent, primary,
    children,
    style,
    color,

    ...rest }) => {
    const colorScheme = useColorScheme()

    return (


        <Text style={[
            {
                fontFamily: 'Avenir Next',
                color
            },
            tint && { color: Colors[colorScheme].tint },
            gray && { color: Colors[colorScheme].gray },
            darkgray && { color: Colors[colorScheme].darkGray },
            verydarkgray && { color: Colors[colorScheme].veryDarkGray },
            white && { color: Colors.white },
            accent && { color: Colors.accent },
            primary && { color: Colors.primary },
            p && { fontSize: 14 },
            h1 && { fontSize: 36 },
            h2 && { fontSize: 28 },
            h3 && { fontSize: 20 },
            h4 && { fontSize: 18 },
            h5 && { fontSize: 16 },

            style
        ]} {...rest}>

            {children}

        </Text>


    )
}


export const BoldText = ({
    h1, h2, h3, h4, h5, p = true,
    tint = true, gray, darkgray, verydarkgray,
    white, accent, primary,
    children,
    style,
    color,
    ...rest }) => {
    const colorScheme = useColorScheme()

    return (

        <View>


            <Text style={[
                {
                    fontFamily: 'AvenirNext-Medium',
                    color,

                },
                tint && { color: Colors[colorScheme].tint },
                gray && { color: Colors[colorScheme].gray },
                darkgray && { color: Colors[colorScheme].darkGray },
                verydarkgray && { color: Colors[colorScheme].veryDarkGray },
                white && { color: Colors.white },
                accent && { color: Colors.accent },
                primary && { color: Colors.primary },
                p && { fontSize: 14 },
                h3 && { fontSize: 20 },
                h4 && { fontSize: 18 },
                h5 && { fontSize: 16 },

                style
            ]} {...rest}>

                {children}

            </Text>
        </View>

    )
}