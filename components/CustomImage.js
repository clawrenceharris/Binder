import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'

const CustomImage = ({ source, style, priority, tintColor, ...rest }) => {

    return (
        <Image
            style={style}
            tintColor={style.tintColor || tintColor}
            source={{ ...source, /*priority: FastImage.priority.high*/ }}
            {...rest}
        />

    )
}

export default CustomImage