import {
  View,
  ScrollView,
  Animated,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { assets, Colors } from "../../constants";
import { Dropdown } from "react-native-element-dropdown";
import Button from "../../components/Button";
import { auth } from "../../Firebase/firebase";
import useColorScheme from "../../hooks/useColorScheme";
import { useSelector } from "react-redux";
import StyledTextInput from "../../components/StyledTextInput";
import { Switch } from "react-native-paper";
import FilterButton from "../../components/FilterButton";
import "firebase/compat/storage";
import { postDeskItem, updateDeskItem } from "../../services/desk";
import AnimatedHeader from "../../components/AnimatedHeader";
import {
  LightText,
  MediumText,
  RegularText,
} from "../../components/StyledText";
import styles from "./styles";
import ToggleAnonymity from "../../components/ToggleAnonymity";
import { saveMediaToStorage } from "../../services/media";
import CustomImage from "../../components/CustomImage";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getItemLayout } from "../../utils";
import SelectionButton from "../../components/SelectionButton";
import subjects from "../../constants/Subjects";
const EditDeskItemB = (props) => {
  const { useCase, deskItem, onSave, questions, type } = props.route.params;
  const colorScheme = useColorScheme();
  const [classId, setClassId] = useState(deskItem?.classId || null);
  const divisionTypes = [
    { label: "Chapter", value: "Chapter" },
    { label: "Section", value: "Section" },
    { label: "Unit", value: "Unit" },
  ];
  const [title, setTitle] = useState(deskItem?.title || "");
  const [divisionNumber, setDivisionNumber] = useState(
    deskItem?.divisionNumber ? deskItem.divisionNumber + "" : ""
  );
  const [isPublic, setIsPublic] = useState(
    deskItem?.isPublic != null ? deskItem?.isPublic : true
  );
  const [description, setDescription] = useState(deskItem?.description || "");
  const [isAnonymous, setIsAnonymous] = useState(
    deskItem?.isAnonymous != null ? deskItem.isAnonymous : false
  );
  const [cards, setCards] = useState(deskItem?.cards || []);
  const [media, setMedia] = useState(deskItem?.media || []);
  const [divisionType, setDivisionType] = useState(
    deskItem?.divisionType || divisionTypes[0].value
  );
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [scrollRef, setScrollRef] = useState(null);
  const currentUser = useSelector((state) => state.userState.currentUser);
  const chats = useSelector((state) => state.userChatsState.chats);
  const classes = chats.filter((item) => item.type == "class");
  const [loading, setLoading] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [time, setTime] = useState(deskItem?.time || "untimed");
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subject, setSubject] = useState(deskItem?.subject || "");
  const [showInExplore, setShowInExplore] = useState(
    deskItem?.showInExplore || false
  );
  const data = {
    classId,
    title: title.trim(),
    divisionType: !divisionNumber ? null : divisionType,
    divisionNumber: divisionNumber ? +divisionNumber : null,
    description: description.trim(),
    isPublic,
    showInExplore,
    subject,
    isAnonymous,
    uid: auth.currentUser.uid,
    type: type,
  };

  const notesData = {
    ...data,
    media,
  };
  const flashcardsData = {
    ...data,
    cards,
  };

  const gameData = {
    ...data,
    questions,
    time,
  };

  const canContinue = () => {
    return title.trim().length > 0;
  };
  const uploadCards = (id) =>
    new Promise((resolve, reject) => {
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].cardA.isImage) {
          const media = cards[i].cardA.data;
          const filename = media.substring(media.lastIndexOf("/") + 1);
          const path = `desk-item/${auth.currentUser.uid}/${
            id + i
          }/${filename}`;

          saveMediaToStorage(media, path)
            .then((url) => {
              cards[i].cardA.data = url;
            })
            .catch(reject);
        }

        if (cards[i].cardB.isImage) {
          const media = cards[i].cardB.data;
          const filename = media.substring(media.lastIndexOf("/") + 1);
          const path = `desk-item/${auth.currentUser.uid}/${
            id + i
          }/${filename}`;

          saveMediaToStorage(media, path)
            .then((url) => {
              cards[i].cardB.data = url;
            })
            .catch(reject);
        }
      }
      resolve();
    });
  const uploadQuestions = (id) =>
    new Promise((resolve, reject) => {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].image) {
          const media = questions[i].image;
          const filename = media.substring(media.lastIndexOf("/") + 1);
          const path = `desk-item/${auth.currentUser.uid}/${
            id + i
          }/${filename}`;

          saveMediaToStorage(media, path)
            .then((url) => {
              questions[i].image = url;
            })
            .catch(reject);
        }
        for (let j = 0; j < questions[i].answerChoices.length; j++) {
          if (questions[i].answerChoices[j].isImage) {
            const media = questions[i].answerChoices[j].data;
            const filename = media.substring(media.lastIndexOf("/") + 1);
            const path = `desk-item/${auth.currentUser.uid}/${
              id + i + j
            }/${filename}`;

            saveMediaToStorage(media, path)
              .then((url) => {
                questions[i].answerChoices[j].data = url;
              })
              .catch(reject);
          }
        }
      }
      resolve();
    });
  const uploadMedia = (id) =>
    new Promise((resolve, reject) => {
      for (let i = 0; i < media.length; i++) {
        const filename = media[i].substring(media[i].lastIndexOf("/") + 1);
        const path = `desk/${auth.currentUser.uid}/${id + i}/${filename}`;

        saveMediaToStorage(media[i], path)
          .then((url) => {
            resolve(url);
          })
          .catch(reject(e));
      }
    });

  const handleSave = async () => {
    setLoading(true);
    props.onTaskStart("Saving...");

    let data = null;

    //set the data we need given the current desk type
    if (type == "Flashcards") {
      data = flashcardsData;
    } else if (type == "Game") {
      data = gameData;
    } else {
      data = notesData;
    }

    //if we are creating a new desk item
    if (useCase == "new desk item") {
      //post the desk item with all its data
      postDeskItem(data)
        .then((id) => {
          //update the cards, questions and media and update the desk item with the each
          if (type == "Flashcards")
            uploadCards(id).then(() => updateDeskItem(id, { cards }));
          else if (type == "Game")
            uploadQuestions(id).then(() => updateDeskItem(id, { questions }));
          else
            uploadMedia(id).then((url) => updateDeskItem(id, { media: url }));
        })
        .then(() => {
          setLoading(false);
          props.onTaskComplete("Saved!");
          props.navigation.pop(2);
        })

        .catch((e) => {
          props.onTaskError(e.message);
        });
    }
    //otherwise, if we are editing an existing desk item
    //update the desk item and update the it to match the uplaoded items
    else
      updateDeskItem(deskItem.id, data)
        .then(() => {
          if (type == "Flashcards")
            uploadCards(deskItem.id).then(() =>
              updateDeskItem(deskItem.id, { cards })
            );
          else if (type == "Game")
            uploadQuestions(deskItemid).then(() =>
              updateDeskItem(deskItem.id, { questions })
            );
          else
            uploadMedia(deskItem.id).then((url) =>
              updateDeskItem(deskItem.id, { media: url })
            );
        })
        .then(() => {
          setLoading(false);
          props.onTaskComplete("Saved!");
          onSave && onSave(data);
          props.navigation.pop(2);
        })

        .catch((e) => {
          props.onTaskError(e.message);
        });
  };

  const onClassSelect = (item) => {
    if (classId == item.id) {
      return setClassId(null);
    } else {
      setClassId(item.id);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
      >
        <CustomBottomSheet
          onDismiss={() => setShowTimeModal(false)}
          snapPoints={[300]}
          onToggle={() => setShowTimeModal(false)}
          show={showTimeModal}
          renderContent={() => (
            <View style={{ paddingHorizontal: 30 }}>
              <Picker
                selectedValue={time}
                style={{ width: "100%", height: 200 }}
                enableInput={false}
                onValueChange={(value, index) => {
                  setTime(value);
                }}
              >
                <Picker.Item label="10 sec" value={10} />
                <Picker.Item label="20 sec" value={20} />
                <Picker.Item label="30 sec" value={30} />
                <Picker.Item label="40 sec" value={40} />
                <Picker.Item label="50 sec" value={50} />
                <Picker.Item label="60 sec" value={60} />
                <Picker.Item label="180 sec" value={180} />
                <Picker.Item label="300 sec" value={300} />
                <Picker.Item label="∞ no limit" value={"untimed"} />
              </Picker>
              <Button title="Done" onPress={() => setShowTimeModal(false)} />
            </View>
          )}
        />
        <CustomBottomSheet
          onDismiss={() => setShowSubjectModal(false)}
          show={true}
          snapPoints={[300]}
          renderContent={() => (
            <View style={{ padding: 15, alignItems: "center", flex: 1 }}>
              <FlatList
                data={subjects}
                numColumns={3}
                getItemLayout={getItemLayout}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSubject(item);
                      setShowSubjectModal(false);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors[colorScheme].lightGray,
                        borderRadius: 25,
                        paddingHorizontal: 15,
                        padding: 8,
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                    >
                      <RegularText>{item}</RegularText>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
              <Button title="Done" onPress={() => setShowSubjectModal(false)} />
            </View>
          )}
        />

        <AnimatedHeader
          animatedValue={scrollY}
          title={useCase == "new desk item" ? "New " + type : "Edit " + type}
          direction={"horizontal"}
        />

        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          style={{ paddingHorizontal: 15 }}
          ref={(ref) => setScrollRef(ref)}
          showsVerticalScrollIndicator={false}
        >
          {type == "Game" && (
            <View>
              <MediumText verydarkgray h4 style={styles.sectionHeaderText}>
                {"Game Settings"}
              </MediumText>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RegularText h4 style={{ flex: 1 }}>
                  Time Limit:
                </RegularText>

                <StyledTextInput
                  placeholder="Time"
                  editable={false}
                  containerStyle={{ flex: 1 }}
                  value={time.toString()}
                  isClearable={false}
                  onPress={() => setShowTimeModal(true)}
                  rightIcon={
                    <CustomImage
                      source={assets.down_arrow}
                      style={{
                        width: 28,
                        height: 28,
                        tintColor: Colors[colorScheme].darkGray,
                      }}
                    />
                  }
                />
                <RegularText h5 style={{ flex: 1, marginLeft: 10 }}>
                  seconds
                </RegularText>
              </View>
            </View>
          )}

          <MediumText verydarkgray h4 style={styles.sectionHeaderText}>
            {"Topic Information"}
          </MediumText>

          {classes.length > 0 && (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {classes.map((item) => (
                  <FilterButton
                    key={item.id}
                    onPress={(item) => onClassSelect(item)}
                    item={{
                      text: item.name,
                      id: item.id,
                      imageURL: item.photoURL,
                      icon: item.icon,
                      emoji: item.emoji,
                      colors: item?.colors,
                    }}
                    isSelected={item.id === classId}
                  />
                ))}
              </ScrollView>
              <RegularText darkgray style={{ marginTop: 10 }}>
                {type[type.length - 1] == "s"
                  ? "Select which class your " + type + " are for."
                  : "Select which class your " + type + " is for"}
              </RegularText>
            </View>
          )}

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Dropdown
              data={divisionTypes}
              value={divisionType}
              onChange={(item) => {
                setDivisionType(item.value);
              }}
              placeholderStyle={{
                color: "darkgray",
                fontFamily: "Avenir Next",
              }}
              style={{
                width: "50%",
                height: 42,
                borderRadius: 50,
                backgroundColor: Colors[colorScheme].lightGray,
                padding: 10,
              }}
              maxHeight={400}
              containerStyle={{
                backgroundColor: colorScheme === "light" ? "#E5E5E5" : "black",
                borderWidth: 0,
                borderRadius: 15,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colorScheme === "light" ? "#E5E5E5" : "black",
                borderRadius: 15,
              }}
              itemTextStyle={{ color: Colors[colorScheme].tint }}
              selectedTextStyle={{ color: Colors[colorScheme].tint }}
              iconColor={Colors[colorScheme].darkGray}
              iconStyle={{ width: 25, height: 25 }}
              fontFamily="Avenir Next"
              showsVerticalScrollIndicator={false}
              autoScroll={false}
              placeholder={divisionType}
            />

            <StyledTextInput
              isClearable
              containerStyle={{ flex: 1, marginLeft: 20 }}
              placeholder={divisionType + " number"}
              value={divisionNumber}
              onChangeText={setDivisionNumber}
              keyboardType="decimal-pad"
              returnKeyType="done"
              returnKeyLabel="done"
            />
          </View>

          <StyledTextInput
            placeholder="Select a subject"
            rightIcon={
              <CustomImage
                source={assets.down_arrow}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: Colors[colorScheme].darkGray,
                }}
              />
            }
            isClearable={false}
            editable={false}
            value={subject}
            onPress={() => setShowSubjectModal(true)}
            containerStyle={{ marginTop: 20 }}
          />
          <StyledTextInput
            containerStyle={{ marginTop: 20 }}
            isClearable
            placeholder={"Topic title"}
            value={title}
            onChangeText={setTitle}
          />

          <MediumText h4 verydarkgray style={styles.sectionHeaderText}>
            {"Description"}
          </MediumText>

          <StyledTextInput
            multiline
            placeholder={"Add a description"}
            value={description}
            onChangeText={setDescription}
            style={{ height: 100 }}
            containerStyle={{ borderRadius: 15 }}
            onFocus={() => scrollRef.scrollToEnd()}
            isClearable
          />

          <MediumText h4 verydarkgray style={styles.sectionHeaderText}>
            {"Privacy"}
          </MediumText>

          <View
            style={{
              borderRadius: 15,
              padding: 15,
              backgroundColor: Colors[colorScheme].lightGray,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <RegularText h4>{"Public"}</RegularText>
              <Switch
                color={Colors.accent}
                value={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
            </View>

            <RegularText darkgray>
              {isPublic
                ? type[type.length - 1] == "s"
                  ? "Anyone can see these " + type + "."
                  : "Anyone can see this " + type + "."
                : type[type.length - 1] == "s"
                ? "Only you can see these " + type + "."
                : "Only you can see this " + type + "."}
            </RegularText>
          </View>

          <ToggleAnonymity
            style={{ marginTop: 20 }}
            action={"Save"}
            isOn={!isAnonymous}
            user={currentUser}
            onToggle={() => setIsAnonymous(!isAnonymous)}
          />

          <LightText darkgray style={{ marginTop: 10 }}>
            {"Save your " +
              type +
              " anonomously to keep your name and profile picture from appearing on them. This will also hide them from others in your Desk."}
          </LightText>

          <TouchableWithoutFeedback
            onPress={() => setShowInExplore(!showInExplore)}
          >
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                borderRadius: 50,
                padding: 10,
                justifyContent: "space-between",
                backgroundColor: Colors[colorScheme].lightGray,
              }}
            >
              <RegularText h4>{"Show in Explore"}</RegularText>
              <SelectionButton
                isSelected={showInExplore}
                onSelect={() => setShowInExplore(!showInExplore)}
                inactiveColor={Colors[colorScheme].gray}
              />
            </View>
          </TouchableWithoutFeedback>
          <LightText darkgray>
            {type[type.length - 1] == "s"
              ? "Post these " +
                type +
                " to Explore where anyone can view them, including students who are not in your school."
              : "Post this " +
                type +
                " to Explore where anyone can view it, including students who are not in your school."}
          </LightText>
          <View style={{ height: 100 }} />
        </ScrollView>

        {canContinue() && (
          <Button
            title={"Save"}
            loading={loading}
            colors={[Colors.primary, Colors.primary]}
            disabled={
              deskItem &&
              deskItem.title == title &&
              deskItem.description == description &&
              (deskItem?.media == media ||
                deskItem?.cards == cards ||
                deskItem?.questions == questions) &&
              deskItem.classId == classId &&
              deskItem.divisionNumber == divisionNumber &&
              deskItem.divisionType == divisionType &&
              deskItem.isPublic == isPublic &&
              deskItem.isAnonymous == isAnonymous
            }
            onPress={handleSave}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              borderRadius: 0,
              height: 80,
            }}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default EditDeskItemB;
