import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { Colors } from "../constants";
import useColorScheme from "../hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { SHADOWS } from "../constants/Theme";
import { ActivityIndicator } from "react-native-paper";
import { MediumText } from "./StyledText";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TIMING_CONFIG = {
  duration: 150,
  damping: 80,
  overshootClamping: true,
  stiffness: 500,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};
const BottomBarButton = ({
  disabled,
  animationEnabled,
  color = Colors.primary,
  type,
  activeOpacity,
  onPress,
  style,
  title,
  tint,
  titleStyle,
  icon,
  loading,
  ...props
}) => {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const onButtonPress = () => {
    if (!disabled && !loading && onPress) {
      setTimeout(() => onPress(), 150);
    }
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      width: "100%",
      height: 80,
      borderRadius: 0,
      position: "absolute",
      bottom: 0,
      backgroundColor: disabled ? Colors[colorScheme].gray : color,
      marginTop: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      color: disabled ? Colors[colorScheme].darkGray : tint || Colors.white,
      marginLeft: icon && 3,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={() => (scale.value = type == "zoom-in" ? 1.1 : 0.9)}
      onPressOut={() => (scale.value = 1)}
      disabled={disabled}
      onPress={onButtonPress}
    >
      <View style={[styles.buttonContainer, style]}>
        {!loading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {icon}

            {title && (
              <MediumText h4 style={[styles.title, titleStyle]}>
                {title}
              </MediumText>
            )}
          </View>
        ) : (
          <ActivityIndicator color={tint || Colors.white} size={"small"} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BottomBarButton;
