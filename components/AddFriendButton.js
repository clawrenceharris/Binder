import { View, Text } from 'react-native'
import React from 'react'

const AddFriendButton = ({ onPress }) => {
  return (

    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}

    >



      <Image source={assets.person} style={styles.quickActionIcon} />
      <Image source={assets.add} style={styles.addIcon} />





    </TouchableOpacity>

  )
}

export default AddFriendButton