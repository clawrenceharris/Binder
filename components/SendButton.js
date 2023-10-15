import React from 'react'
import { assets, Colors } from '../constants'
import Button from './Button'
import CustomImage from './CustomImage'

const SendButton = ({ colors, loading, animationEnabled, disabled, size, onPress, style }) => {
    return (
        <Button
            colors={colors}
            loading={loading}
            disabled={disabled}
            animationEnabled={animationEnabled}
            onPress={onPress}
            style={{ width: size || 40, height: size || 40, paddingHorizontal: 0, ...style }}
            icon={<CustomImage source={assets.send} style={{ marginRight: 5, tintColor: Colors.white, width: (size || 40) - 12, height: (size || 40) - 12, transform: [{ rotate: '45deg' }], }} />}
        />
    )
}

export default SendButton