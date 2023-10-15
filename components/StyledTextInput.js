import { View, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import CustomImage from './CustomImage';








const StyledTextInput = ({
  style,
  containerStyle,
  content,
  loading,
  onPress,
  returnKeyType,
  children,
  icon,
  rightIcon,
  iconStyle,
  isClearable,
  inputRef,
  ...props }) => {
  const colorScheme = useColorScheme()
  const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      borderColor: '#EEF1F4',

      borderRadius: 25,
      alignItems: 'center',
      padding: 5,
      minHeight: 40,
      paddingHorizontal: 10,
      flexDirection: 'row',



    },

    icon: {
      zIndex: 1,
      left: 7,
      position: 'absolute',
      ...iconStyle

    },
    rightIcon: {
      position: 'absolute',
      right: 5
    },
    input: {
      flex: 1,
      fontSize: 16,
      maxHeight: 200,
      padding: 5,
      paddingLeft: icon || props.placeholder.includes('Search') ? 25 : 0,
      fontFamily: 'AvenirNext-Medium',
      color: Colors[colorScheme].tint,
      borderRadius: 25,
      ...style

    },

    contentContainer: {
      padding: 8,
      paddingLeft: 40,
    },

    clearBtn: {
      padding: 5,

      position: 'absolute',
      right: 10,

      borderRadius: 50
    }
  })
  return (
    <View
      style={[styles.mainContainer, { backgroundColor: Colors[colorScheme].lightGray, ...containerStyle, }]}>

      <View style={styles.icon}>
        {props.placeholder.includes("Search") ?
          <CustomImage source={assets.search} style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }} />
          :

          icon
        }


      </View>



      {!content ?
        <TextInput
          onPressOut={onPress}
          style={styles.input}
          autoCapitalize={'none'}

          spellCheck={false}
          returnKeyType={returnKeyType}
          placeholderTextColor={Colors[colorScheme].veryDarkGray}
          selectionColor={Colors.accent}
          ref={inputRef}
          {...props} >

          {children}

        </TextInput>

        :
        <View style={[styles.contentContainer, { backgroundColor: Colors[colorScheme].lightGray }]}>

          {content}
        </View>

      }


      {(props.value?.length > 0 || content) && (isClearable || isClearable == null) && !loading &&

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { props.onChangeText(''); props.setContent && props.setContent(null) }}
          style={[styles.clearBtn, { backgroundColor: Colors[colorScheme].darkGray }]}>
          <Image source={assets.close} style={{ width: 12, height: 12, tintColor: Colors[colorScheme].lightGray }} />

        </TouchableOpacity>


      }


      {!loading ? <View


        style={styles.rightIcon}>
        {rightIcon}
      </View>
        :
        <ActivityIndicator color={Colors[colorScheme].darkGray} />
      }

    </View>
  )
}






export default StyledTextInput