import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import ProfileButton from "./ProfileButton";
import { SHADOWS } from "../constants/Theme";
import SelectionButton from "./SelectionButton";
import ScaleButton from "./ScaleButton";
import {
  getDateString,
  getDefaultImage,
  getDisplayNameOrYou,
  getProfileItemsSubtitle,
} from "../utils";
import { RegularText, LightText, MediumText, BoldText } from "./StyledText";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";
import { fetchUser } from "../services/user";
import { auth } from "../Firebase/firebase";
import CustomImage from "./CustomImage";
import moment from "moment";
import { useUser } from "../hooks/useUser";
import { useSelector } from "react-redux";
import { useMessages } from "../hooks/useMessages";
import { StudyBuddyBadge } from "./ProfileBadges";
import Animated, {
  FadeInUp,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";

const ChatListItem = ({
  isSelectable,
  onProfileButtonPress,
  profileButtonDisabled,
  rightIcon,
  onPress,
  style,
  useCase,
  onLongPress,
  chat,
  subtitle,
  isSelected,
  title,
  imageURL,
  disabled,
  icon,
}) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const _studyBuddies = useSelector((state) => state.userState.studyBuddies);
  const studyBuddies = _studyBuddies.map((item) => item?.uid);
  const user = useUser(
    chat?.users?.find((uid) => uid != auth?.currentUser?.uid)
  ).data;

  const lastUser = useUser(chat?.recentActivity?.uid).data;
  if (!chat) {
    return (
      <View style={{ backgroundColor: Colors[colorScheme].darkGray }}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={disabled}
          onPress={onPress}
          style={[
            styles.mainContainer,
            { backgroundColor: Colors[colorScheme].background, ...style },
          ]}
          onLongPress={onLongPress}
        >
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              disabled={profileButtonDisabled}
              style={{ width: 50, height: 50, paddingHorizontal: 0 }}
              onPress={onPress}
              animationEnabled={false}
              icon={
                icon || (
                  <CustomImage
                    source={{ uri: imageURL }}
                    style={{ width: 40, height: 40 }}
                  />
                )
              }
            />

            <View style={{ marginLeft: 10, width: "80%" }}>
              <BoldText h5>{title}</BoldText>

              {subtitle && (
                <LightText darkgray numberOfLines={2}>
                  {subtitle}
                </LightText>
              )}
            </View>
          </View>
          {rightIcon}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={{ backgroundColor: Colors[colorScheme].darkGray }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            onPress
              ? onPress()
              : navigation.navigate("Chat", {
                  ...chat,
                  name:
                    chat.type == "private"
                      ? user?.displayName || "Someone"
                      : chat.name,
                  photoURL:
                    chat.type == "private" ? user?.photoURL : chat.photoURL,
                })
          }
          disabled={disabled}
          onLongPress={onLongPress}
          style={[
            styles.mainContainer,
            { backgroundColor: Colors[colorScheme].background, ...style },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ProfileButton
              emoji={chat?.emoji}
              onPress={() =>
                onProfileButtonPress
                  ? onProfileButtonPress()
                  : navigation.navigate("ChatProfile", { ...chat })
              }
              imageURL={
                chat.type == "private"
                  ? chat.user?.photoURL || user?.photoURL
                  : chat.photoURL
              }
              size={50}
              disabled={profileButtonDisabled}
              defaultImage={chat.icon || getDefaultImage(chat.type)}
              colors={chat?.colors}
              badge={
                user &&
                studyBuddies.includes(user?.uid) &&
                useCase == "chats" && <StudyBuddyBadge />
              }
            />

            <View style={{ marginLeft: 10, width: "75%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {!isSelected && (
                  <RegularText h5>
                    {chat.type == "private"
                      ? chat.user?.displayName || user?.displayName || "Someone"
                      : chat.name}
                  </RegularText>
                )}

                {isSelected && (
                  <MediumText accent h5>
                    {chat?.name}
                  </MediumText>
                )}
              </View>

              {useCase == "chats" &&
                lastUser &&
                chat.recentActivity.content && (
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <LightText darkgray numberOfLines={1}>
                      {getDisplayNameOrYou(lastUser)}
                      {" " + chat.recentActivity.content}
                    </LightText>
                    <LightText darkgray>
                      {" · "}
                      {getDateString(new Date(chat.recentActivity.createdAt))}
                    </LightText>
                  </View>
                )}

              {useCase != "chats" && (
                <LightText darkgray p>
                  {getProfileItemsSubtitle(chat?.users || [], "Member")}
                </LightText>
              )}
            </View>
          </View>
          {isSelectable && !rightIcon && (
            <SelectionButton
              style={{ position: "absolute", right: 15 }}
              isSelected={isSelected}
              onSelect={onPress}
            />
          )}

          {rightIcon && (
            <View style={{ position: "absolute", right: 15 }}>{rightIcon}</View>
          )}

          {useCase == "chats" &&
            !chat.recentActivity?.seenBy?.includes(auth.currentUser.uid) &&
            chat.recentActivity.uid != auth.currentUser.uid && (
              <View
                style={{
                  backgroundColor: Colors.accent,
                  borderRadius: 50,
                  width: 10,
                  height: 10,
                }}
              />
            )}
        </TouchableOpacity>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  bottomContainer: {
    padding: 10,

    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContainer: {
    padding: 10,
    zIndex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flexDirection: "row",

    alignItems: "center",
  },
  mainContainer: {
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    width: "100%",
    justifyContent: "space-between",
  },
});
export default ChatListItem;
