import { View, FlatList, Image, TouchableWithoutFeedback, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { auth, db } from '../Firebase/firebase'
import { Dropdown } from 'react-native-element-dropdown'
import { LightText, MediumText } from '../components/StyledText'

import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import DeskItemThumbnail from '../components/DeskItemThumbnail'
import CustomImage from '../components/CustomImage'
import { fetchUserDeskItems } from '../redux/actions'
import { getDefaultImage, getProfileItemsSubtitle, getResultsFromSearch } from '../utils'
import FilterButton from '../components/FilterButton'
import Header from '../components/Header'
import Button from '../components/Button'
import { useDeskItems } from '../hooks/useDeskItems'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import StyledTextInput from '../components/StyledTextInput'

const SelectDeskItem = (props) => {
    const colorScheme = useColorScheme();
    const chats = useSelector(state => state.userChatsState.chats)
    const classes = chats.filter(item => item.type == 'class');
    const insets = useSafeAreaInsets();
    const [deskType, setDeskType] = useState('Notes');
    const { onSubmit } = props;
    const [selectedItem, setSelectedItem] = useState(null);
    const [search, setSearch] = useState('');
    const [showDeskTypes, setShowDeskTypes] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const { deskItems } = useDeskItems(auth.currentUser.uid);
    const [deskItemsResults, setDeskItemsResults] = useState(deskItems);
    const users = useSelector(state => state.usersState.users)
    const deskTypes = [
        'Notes',
        'Flashcards',
        'Games',
        'Study Guides',
        'Graded Work',
        'Other',
    ];
    useEffect(() => {

        const searchResults = getResultsFromSearch(deskItems, search);
        if (selectedFilter) {
            setDeskItemsResults(searchResults
                .filter(el => deskType.startsWith(el.type))
                .filter(el => el.class.id == selectedFilter.id));
        }
        else {

            setDeskItemsResults(searchResults
                .filter(el => deskType.startsWith(el.type)));
        }


    }, [deskType, selectedFilter, deskItems, search])


    const getItemLayout = (data, index) => {
        const productHeight = 80;
        return {
            length: productHeight,
            offset: productHeight * index,
            index,
        };
    };
    const isSelected = (item) => {
        return selectedItem?.id == item.id;
    }
    const onSelect = (item) => {
        if (isSelected(item)) {
            return setSelectedItem(null);
        }
        else {
            return setSelectedItem(item)
        }
    }
    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    }

    const isFilterSelected = (item) => {
        if (item?.more) {
            for (let i = 0; i < item.more.length; i++) {
                if (item.more[i].id == selectedFilter?.id) {
                    return true
                }
            }
        }
        else
            return item.id == selectedFilter?.id
        return false
    }



    const filter = (item) => {


        if (item != null && item.id != selectedFilter?.id) {
            setSelectedFilter(item)
        }
        else {

            setSelectedFilter(null)
        }

    }

    const onDonePress = () => {

        setTimeout(() => {
            onSubmit && onSubmit(selectedItem);
        }, 200);
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>





            <MediumText h4
                disabled={!selectedItem}
                accent={selectedItem}
                onPress={onDonePress}
                style={{ alignSelf: 'flex-end', margin: 15 }}
                darkgray={!selectedItem}>Add</MediumText>

            <TouchableWithoutFeedback onPress={() => {
                setShowDeskTypes(true);
                setSelectedItem(null);
            }}>

                <View style={{ marginBottom: 10, backgroundColor: Colors[colorScheme].tint, borderRadius: 50, alignSelf: 'center', padding: 10, paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <MediumText white h5>{deskType}</MediumText>
                    <CustomImage source={assets.down_arrow} style={{ marginLeft: 5, width: 28, height: 28, tintColor: Colors[colorScheme].background }} />

                </View>
            </TouchableWithoutFeedback>




            {
                !showDeskTypes &&
                <View style={{ padding: 10, height: '100%' }}>
                    <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
                        <StyledTextInput
                            placeholder={"Search " + deskType}
                            value={search}
                            onChangeText={setSearch}

                        />
                    </View>
                    <FlatList
                        refreshControl={<RefreshControl
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            color={Colors[colorScheme].darkGray}
                        />}
                        ListEmptyComponent={<MediumText darkgray h5 style={{ alignSelf: 'center', marginTop: 100 }}>{search ? "No results" : "No items"}</MediumText>}

                        data={deskItemsResults}
                        getItemLayout={getItemLayout}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator
                        renderItem={({ item }) =>

                            <DeskItemThumbnail
                                style={{ marginRight: 5, marginTop: 10 }}
                                selectionMode={true}
                                onPress={() => onSelect(item)}
                                deskItem={item}
                                isSelected={isSelected(item)}
                                deskType={deskType}

                                user={users.find(user => user.uid == item.uid)}
                            />

                        }

                    />
                </View>
            }


            {
                showDeskTypes && deskItems &&
                <View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {deskTypes.map((item) => {
                            const deskItem = deskItems.find(el => item.startsWith(el.type));
                            const items = deskItems.filter(el => item.startsWith(el.type));
                            return (

                                <View
                                    key={item}
                                    style={{ backgroundColor: Colors[colorScheme].darkGray }}>


                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => { setDeskType(item); setShowDeskTypes(false); }}
                                        style={{ backgroundColor: Colors[colorScheme].background, padding: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors[colorScheme].lightGray, width: 55, height: 55, overflow: 'hidden', borderRadius: 15, borderWidth: 1, borderColor: 'lightgray' }}>
                                                {items.length ?

                                                    deskItem.type != 'Flashcards' && deskItem.type != "Game" ?
                                                        <CustomImage source={{ uri: deskItem.media[0] }} style={{ width: '100%', height: '100%' }} />
                                                        :
                                                        deskItem.type == "Flashcards" ?
                                                            <CustomImage source={assets.flashcards} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray, transform: [{ rotate: '90deg' }] }} />
                                                            :
                                                            <CustomImage source={assets.play} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray }} />
                                                    :
                                                    <CustomImage source={assets.desk} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray }} />

                                                }

                                            </View>
                                            <View style={{ marginLeft: 10 }}>

                                                <MediumText h4 accent={deskType.indexOf(item) > -1} >{deskTypes.indexOf(item) > -1 && item}</MediumText>
                                                <LightText darkgray>{getProfileItemsSubtitle(items, "Item")}</LightText>
                                            </View>



                                        </View>

                                        <CustomImage source={assets.right_arrow} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray }} />

                                    </TouchableOpacity>
                                </View>)
                        })}
                        <View style={{ height: 150 }} />
                    </ScrollView>
                </View>
            }


            {
                !showDeskTypes &&
                <View style={{ position: 'absolute', bottom: 0, padding: 10, backgroundColor: Colors[colorScheme].invertedTint, borderTopColor: 'lightgray', borderTopWidth: 1, width: '100%' }}>

                    <FlatList
                        style={{ paddingBottom: 40, marginBottom: insets.bottom }}
                        data={classes}
                        horizontal
                        renderItem={({ item }) => (
                            <FilterButton
                                onPress={(item) => filter(item)}
                                isSelected={isFilterSelected(item)}
                                item={{
                                    text: item.name,
                                    imageURL: item.photoURL,
                                    emoji: item.emoji,
                                    icon: item.icon || getDefaultImage('class'),
                                    colors: item?.colors,
                                    id: item.id,
                                }} />
                        )}
                    />
                </View>
            }

        </View >
    )
}




export default SelectDeskItem