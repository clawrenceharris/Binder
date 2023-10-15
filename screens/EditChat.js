import { View, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import useColorScheme from '../hooks/useColorScheme'
import { assets, Colors } from '../constants'
import { ProfileButton } from '../components'
import gradients from '../constants/Gradients'
import StyledTextInput from '../components/StyledTextInput'
import { RegularText } from '../components/StyledText'
import { auth } from '../Firebase/firebase'
import { capitalize } from '../utils'
import { addSystemMessage, createChat } from '../services/chats'
import Button from '../components/Button'
import { Dropdown } from 'react-native-element-dropdown'
import { useSelector } from 'react-redux'
import { Switch } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomImage from '../components/CustomImage'


const EditChat = (props) => {
    const colorScheme = useColorScheme();
    const [image, setImage] = useState(props.route.params?.photoURL || null);
    const [icon, setIcon] = useState(props.route.params?.icon || assets.group_chat.uri);
    const [colors, setColors] = useState(props.route.params?.colors || gradients[0]);
    const { useCase, onSubmit, users } = props.route.params;
    const [name, setName] = useState(props.route.params?.name || '');
    const [type, setType] = useState(props.route.params?.type || 'group');
    const [emoji, setEmoji] = useState(props.route.params?.emoji || '');
    const [isPublic, setIsPublic] = useState(props.route.params?.isPublic == null ? true : props.route.params.isPublic);
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(state => state.userState.currentUser);
    const insets = useSafeAreaInsets();
    const data = [
        { label: 'School', value: 'school' },
        { label: 'Class', value: 'class' },
        { label: 'Group', value: 'group' },
        { label: 'Club', value: 'club' },

    ];


    const onSavePress = () => {

        const data = {
            name,
            type,
            colors,
            emoji,
            icon,
            isPublic,
            photoURL: image,
        }
        props.navigation.goBack();
        onSubmit(data);

    }

    const onCreatePress = () => {
        const chat = {
            name,
            photoURL: image,
            colors,
            users,
            type,
            icon,
            emoji,
            schoolId: currentUser.schoolId,
            isPublic,
            creator: auth.currentUser.uid,

        }

        createChat(chat)
            .then((id) => {
                addSystemMessage(id, auth.currentUser.uid, " created the " + type)
                if (onSubmit)
                    onSubmit({ id, ...chat })

                else {
                    props.navigation.popToTop();
                    setTimeout(() => {
                        props.navigation.navigate('Chat', { id, ...chat })

                    }, 100);
                }
            })
    }
    const goToEditImage = () => {
        props.navigation.navigate('EditChatImage', {
            setEmoji,
            setIcon,
            setImage,
            setColors,
            emoji,
            icon,
            image,
            colors
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header title={useCase == "new group" ? "New Community" : "Edit Community"} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="height">
                <View style={{ paddingHorizontal: 30 }}>
                    <View style={{ alignItems: 'center' }}>


                        <View>

                            <ProfileButton
                                imageURL={image}
                                size={120}
                                emoji={emoji}
                                defaultImage={icon}
                                onPress={goToEditImage}
                                colors={colors}

                            />
                            <TouchableWithoutFeedback onPress={goToEditImage}>

                                <View style={{ borderWidth: 3, borderColor: Colors[colorScheme].background, position: 'absolute', right: -20, backgroundColor: Colors.accent, width: 50, height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    <CustomImage source={assets.pencil_o} style={{ width: 28, height: 28, tintColor: Colors.white }} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <Dropdown
                            data={data}
                            value={type}
                            onChange={item => { setType(item.value) }}
                            placeholderStyle={{ color: 'darkgray', fontFamily: 'Avenir Next' }}
                            style={{ marginTop: 20, height: 47, borderRadius: 50, backgroundColor: Colors[colorScheme].lightGray, width: 150, paddingHorizontal: 20 }}
                            maxHeight={400}
                            containerStyle={{ backgroundColor: Colors[colorScheme].lightGray, borderWidth: 0, borderRadius: 15 }}
                            labelField="label"
                            valueField="value"
                            itemContainerStyle={{ backgroundColor: Colors[colorScheme].lightGray, borderRadius: 15 }}
                            itemTextStyle={{ color: Colors[colorScheme].tint }}
                            selectedTextStyle={{ color: Colors[colorScheme].tint }}
                            fontFamily='AvenirNext-Medium'
                            showsVerticalScrollIndicator={false}
                            autoScroll={false}
                            activeColor={Colors.white}
                            placeholder={type}
                        />

                    </View>

                    <StyledTextInput
                        containerStyle={{ marginTop: 20 }}
                        placeholder={capitalize(type) + " name"}
                        value={name}
                        onChangeText={setName}
                        isClearable
                    />


                    <View style={{ marginTop: 20, borderRadius: 15, padding: 15, backgroundColor: Colors[colorScheme].lightGray }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <RegularText h4 >{"Public"}</RegularText>
                            <Switch color={Colors.accent} value={isPublic} onChange={() => setIsPublic(!isPublic)} />
                        </View>

                        <RegularText style={{ marginTop: 10 }} darkgray>{isPublic ?
                            "Anyone can join this " + capitalize(type) +
                            " and it is visible in Discover." :
                            "Only current members can add new memebers to this " + capitalize(type) +
                            " and it is hidden in Discover."} </RegularText>
                    </View>
                </View>
                {useCase == 'new group' &&

                    <Button
                        title={"Create " + capitalize(type)}
                        onPress={onCreatePress}
                        disabled={!name}
                        style={{ position: 'absolute', bottom: insets.bottom }}
                    />}

                {useCase == 'edit group' &&

                    <Button
                        title='Save'
                        disabled={
                            props.route.params.photoURL == image &&
                            props.route.params.colors == colors &&
                            props.route.params.isPublic == isPublic &&
                            props.route.params.name == name &&
                            props.route.params.type == type
                        }
                        onPress={onSavePress}
                        loading={loading}
                        colors={[Colors.primary, Colors.primary]}
                        style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0, marginTop: 30 }}

                    />

                }
            </KeyboardAvoidingView>
        </View>
    )
}

export default EditChat