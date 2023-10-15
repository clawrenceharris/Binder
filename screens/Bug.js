import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import useColorScheme from '../hooks/useColorScheme'
import { Colors, assets } from '../constants';
import { MediumText, RegularText } from '../components/StyledText';
import { FlatList } from 'react-native-gesture-handler';
import Header from '../components/Header';
import { SHADOWS } from '../constants/Theme';
import CustomImage from '../components/CustomImage';

const Bug = (props) => {
    const colorScheme = useColorScheme();
    const data = [
        { title: 'Desk', icon: assets.desk },

        { title: 'Profile', icon: assets.person },
        { title: 'Chat', icon: assets.chat_bubble },
        { title: 'Discover', icon: assets.add },
        { title: 'Notifications', icon: assets.bell },

        { title: 'Search', icon: assets.search },
        { title: 'Settings', icon: assets.settings },


        { title: 'Burning Question', icon: assets.fire },
        { title: 'Camera', icon: assets.camera },
    ]
    return (
        <View style={{ backgroundColor: Colors[colorScheme].background, flex: 1 }}>
            <Header
                title="Bug"

            />

            <View style={{ paddingHorizontal: 15 }}>
                <RegularText verydarkgray style={{ textAlign: 'center' }}>Where did you spot an issue?</RegularText>


                <FlatList
                    style={{ marginTop: 20 }}
                    data={data}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => props.navigation.navigate('SendReport', { title: 'Bug', useCase: 'report bug', data: { location: item.title } })}>


                            <View style={{ marginBottom: 15, ...SHADOWS[colorScheme], padding: 15, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors[colorScheme].invertedTint, borderRadius: 15 }}>
                                <CustomImage source={item.icon} style={{ marginRight: 10, width: 22, height: 22, tintColor: Colors[colorScheme].veryDarkGray }} />
                                <RegularText h5>{item.title}</RegularText>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

        </View>
    )
}

export default Bug