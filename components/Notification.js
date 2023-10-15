import { View, Text, TextInput, TouchableOpacity, Animated, Modal, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { auth, db, updateCollection } from '../Firebase/firebase';
import { Colors } from '../constants';
import Button from './Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Notification = ({ show, toValue, height, notificationContainerStyle, children, error }) => {

  const translateValue = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(show);

  const insets = useSafeAreaInsets();
  const toggleModal = () => {
    if (show) {
      setVisible(true)

      Animated.spring(translateValue, {
        toValue: toValue || 1,
        duration: 200,
        useNativeDriver: true
      }).start()

    }
    else {
      Animated.timing(translateValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => {
        setVisible(false)
      });

    }

  }


  useEffect(() => {
    toggleModal()

  }, [show])




  return (



    <View style={{ zIndex: 100 }}>


      {visible &&
        <Animated.View style={[styles.notificationContainer, {
          backgroundColor: error ? Colors.red : Colors.accent,
          transform: [{
            translateY: translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1 - insets.top, insets.top]
            })
          }], ...notificationContainerStyle
        }]} >

          {children}

        </Animated.View>}
    </View>



  )

}

const styles = StyleSheet.create({

  notificationContainer: {
    marginHorizontal: 15,
    width: '95%',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.accent,
    position: 'absolute',
    alignSelf: 'center',





  }
})

export default Notification