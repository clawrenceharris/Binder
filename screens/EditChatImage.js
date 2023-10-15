import { View, useWindowDimensions, FlatList } from 'react-native'
import React, { useState } from 'react'
import useColorScheme from '../hooks/useColorScheme';
import Header from '../components/Header';
import { assets, Colors } from '../constants';
import { ProfileButton } from '../components';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import gradients from '../constants/Gradients';
import { getItemLayout, openMediaLibrary } from '../utils';
import icons from '../constants/Icons';
import Button from '../components/Button';
import { MediumText } from '../components/StyledText';
import CustomImage from '../components/CustomImage';

const EditChatImage = (props) => {
    const colorScheme = useColorScheme();
    const [image, setImage] = useState(props.route.params.image);
    const [icon, setIcon] = useState(props.route.params.icon);
    const [colors, setColors] = useState(props.route.params.colors);
    const [emoji, setEmoji] = useState(props.route.params.emoji);
    const layout = useWindowDimensions();
    const emojis = ["😁", "😋", "🤓", "😎", "😭", "😴", "💀", "🤘", "✌️", "🔥", "❤️", "💛", "💚", "💜", "🕶️", "🌎", "🍕", "⚽️", "🏀", "🏈", "⚾️", "🎾", "🎻", "🎺", "🎮", "💻", "♟️", "🎭", "🎨", "🎬", "🎹", "🏫", "📸", "🔬", "🎉", "🔒", "🖍️", "✏️", "📐", "➗", "🏳️‍🌈", "🇺🇸"]

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Icon' },
        { key: 'second', title: 'Emoji' },

        { key: 'third', title: 'Color' },
    ]);


    const IconScreen = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    getItemLayout={getItemLayout}
                    numColumns={4}
                    data={icons}
                    renderItem={({ item }) => (
                        <ProfileButton
                            onPress={() => { reset(); setIcon(item); }}
                            style={{ margin: 15 }}
                            defaultImage={item}
                        />
                    )}
                />
            </View>
        )
    }
    const reset = () => {
        setIcon(null);
        setImage(null);
        setEmoji(null);
    }
    const EmojiScreen = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    getItemLayout={getItemLayout}
                    numColumns={4}
                    data={emojis}
                    renderItem={({ item }) => (
                        <ProfileButton
                            emoji={item}
                            onPress={() => { reset(); setEmoji(item); }}
                            style={{ margin: 15 }}

                        />
                    )}
                />
            </View>
        )
    }
    const ColorScreen = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    getItemLayout={getItemLayout}
                    numColumns={4}
                    data={gradients}
                    renderItem={({ item }) => (
                        <ProfileButton
                            onPress={() => { setColors(item); }}
                            style={{ margin: 15 }}
                            colors={item}
                        />
                    )}
                />
            </View>
        )
    }
    const onSavePress = () => {
        props.route.params.setImage(image);
        props.route.params.setIcon(icon);
        props.route.params.setColors(colors);
        props.route.params.setEmoji(emoji);

        props.navigation.goBack();
    }

    const renderScene = SceneMap({
        first: IconScreen,
        second: EmojiScreen,
        third: ColorScreen
    });
    const callback = (image) => {
        setImage(image);
        setIcon(null);
    }
    const onCameraPress = () => {
        props.navigation.navigate('Camera', {
            callback,
            useCase: 'single photo to use',
            canRecord: false
        });

    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <Header
                title="Edit Image"
                navigation={props.navigation}
                headerRight={


                    <MediumText accent h4 onPress={onSavePress}>
                        Save
                    </MediumText>

                }
            />
            <View style={{ alignItems: 'center' }}>
                <ProfileButton
                    imageURL={image}
                    defaultImage={icon}
                    size={120}
                    emoji={emoji}
                    colors={colors}


                />
                <View style={{ flexDirection: 'row', marginVertical: 20 }} >


                    <Button
                        onPress={onCameraPress}
                        icon={<CustomImage source={assets.camera_o} style={{ width: 28, height: 28, tintColor: Colors.white }} />}
                        style={{ width: 50, height: 50, paddingHorizontal: 0 }}
                    />
                    <Button
                        onPress={() => openMediaLibrary(callback)}
                        icon={<CustomImage source={assets.image} style={{ width: 28, height: 28, tintColor: Colors.white }} />}
                        style={{ width: 50, height: 50, paddingHorizontal: 0, marginLeft: 20 }}
                    />
                </View>
            </View>

            <TabView
                renderScene={renderScene}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}

                renderTabBar={(props) =>
                    <TabBar
                        {...props}

                        labelStyle={{ color: Colors[colorScheme].tint, fontFamily: 'AvenirNext-Medium' }}
                        indicatorStyle={{ backgroundColor: Colors.accent, borderRadius: 25, height: 5 }}
                        style={{ width: '90%', alignSelf: 'center' }}
                        indicatorContainerStyle={{ backgroundColor: Colors[colorScheme].background }}
                    >

                    </TabBar>

                }
            />

        </View>
    )
}

export default EditChatImage