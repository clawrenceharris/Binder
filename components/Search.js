import {

    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    SectionList,
    Animated,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import { Colors, assets } from '../constants'
import Button from '../components/Button'
import { getDefaultImage, getItemLayout, handleAddFriend } from '../utils'
import { SHADOWS } from '../constants/Theme'
import UserListItem from '../components/UserListItem'
import useColorScheme from '../hooks/useColorScheme'
import StyledTextInput from '../components/StyledTextInput'
import { ChatListItem, ProfileButton } from '../components'
import { MediumText, RegularText } from '../components/StyledText'
import { faker } from '@faker-js/faker'
import { auth } from '../Firebase/firebase'
import { connect, useSelector } from 'react-redux'
import CustomImage from './CustomImage'
import { getChatByUid } from '../services/chats'
import { useNavigation } from '@react-navigation/native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DeskItemThumbnail from './DeskItemThumbnail'
import gradients from '../constants/Gradients'


const Search = ({
    sections,
    useCase,
    renderFilters,
    renderHeader,
    loading,
    renderTextInput,
    ListHeaderComponent,
    submitButtonTitle,
    renderSubmitButtonTitle,
    canCreateNewItem,
    direction,
    selectionLimit,
    placeholder,
    animateButton,
    type,
    onTaskError,
    onTaskStart,
    onTaskComplete,
    handleSearch,
    onRefresh,
    title,
    renderButton,
    headerRight,
    buttonStyle,
    onSubmit,
    onChange,
    InfoComponent,
    profileButtonDisabled,
    isSelectable,
    currentUser,
    chats,
    ...props
}) => {
    const colorScheme = useColorScheme();
    const [selected, setSelected] = useState([]);
    const { height } = Dimensions.get('window');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigation = useNavigation();
    const [newItem, setNewItem] = useState(null);
    const [search, setSearch] = useState('');
    const insets = useSafeAreaInsets();
    const colors = [Colors.blue, Colors.orange, Colors.red, Colors.yellow, Colors.accent, Colors.pink, Colors.primary, Colors.red, Colors.green, Colors.orange, Colors.yellow, Colors.pink, Colors.primary, Colors.blue]
    const animValue = useRef(new Animated.Value(height)).current;
    const users = useSelector(state => state.usersState.users);
    useEffect(() => {
        if (selected.length > 0) {
            Animated.timing(animValue, {
                toValue: height - 120,
                duration: 200,
                useNativeDriver: true
            }).start()
        }
        else if (selected.length == 0) {
            Animated.spring(animValue, {
                toValue: height,
                duration: 300,
                useNativeDriver: true
            }).start()
        }


    }, [selected.length])

    function isSelected(item) {
        if (!isSelectable) {
            return false;
        }
        return selected.includes(item);
    }





    useEffect(() => {
        if (props.selected) {
            setSelected(props.selected)
        }



    }, [props.selected])

    function onSelect(item) {
        //if we cant select leave the function
        if (!isSelectable) {
            return;
        }
        if (selected.includes(item)) //if we select an item that is already selected then remove it from selected data
        {
            return deselect(item);
        }

        if (selected.length === selectionLimit && selectionLimit != 1) { // if we reached the selection limit then do nothing
            return;
        }

        if (selected.length === selectionLimit && selectionLimit == 1) {
            return setSelected([item]); // replace the already selected item with this one

        }

        setSelected([...selected, item]); // add item to selected items array

    }


    const isEmpty = () => {
        for (let i = 0; i < sections.length; i++) {

            if (Array.isArray(sections[i].data[0]) && sections[i].data[0].length > 0) {
                return false
            }

            else if (!Array.isArray(sections[i].data[0]) && sections[i].data.length > 0) {
                return false;
            }
        }
        return true;
    }

    const deselect = (item) => {
        // create a new data array that does not include the selected item
        const deselected = selected.filter(selected => selected != item);

        return setSelected(deselected);
    }



    const SectionHeader = ({ section }) => {
        if (!section.data.length) {
            return null
        }
        if (section.type == 'study buddies')
            if ((typeof section.data == 'object' && !section.data.length) || (Array.isArray(section.data[0]) && !section.data[0].length)) {

                return null
            }



        return (
            <View style={{
                paddingHorizontal: 15,
                height: 30,
                backgroundColor: Colors[colorScheme].background
            }}>

                <MediumText h5>{section.title}</MediumText>


            </View >
        );

    };
    const UserItem = ({ item, useCase, style }) => {
        return (
            <UserListItem
                icon={assets.check}
                style={style}
                isSelectable={isSelectable}
                user={item}
                onProfileButtonPress={profileButtonDisabled ? () => { } : null}
                onTaskError={onTaskError}
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                useCase={useCase}
                isSelected={isSelected(item)}
                onPress={isSelectable ? () => onSelect(item) : null}
                onSelect={() => onSelect(item)}


            />

        )
    }
    const SectionItem = ({ section, item, index }) => {
        const chatIds = chats.map(chat => chat.id);
        const isChatJoined = chatIds.includes(item?.id);
        return (
            <View>


                {section.type === 'chats' &&

                    <ChatListItem
                        useCase={useCase}
                        isSelectable={isSelectable && (!isChatJoined || useCase != 'new chat')}
                        chat={item}
                        disabled={isChatJoined && useCase == 'new chat'}
                        rightIcon={isChatJoined && useCase == 'new chat' &&
                            <View style={{ paddingHorizontal: 20, backgroundColor: Colors[colorScheme].lightGray, borderRadius: 25, padding: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={assets.check} style={{ width: 15, height: 15, tintColor: Colors.green }} />
                                <RegularText style={{ color: Colors.green, marginLeft: 5 }}>{"Joined"}</RegularText>
                            </View>

                        }
                        isSelected={isSelected(item)}
                        onPress={isSelectable ? () => onSelect(item) : null}
                        profileButtonDisabled={isChatJoined && useCase == 'new chat'}
                    />

                }


                {section.type === 'desk items' &&
                    <FlatList

                        horizontal={section.horizontal}
                        data={item}
                        renderItem={({ item }) =>
                            <View style={{ margin: 15 }}>
                                <DeskItemThumbnail deskItem={item} user={users.find(user => user.uid == item.uid)} />
                            </View>
                        }
                    />



                }


                {section.type === 'users' &&

                    <UserItem useCase={'users'} item={item} />

                }
                {section.type === 'subjects' &&


                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal

                        data={item}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => section.onPress(item)}>


                                <View style={{ backgroundColor: colors[index] + '90', borderRadius: 15, overflow: 'hidden', margin: 10, width: 200, justifyContent: 'center', height: 70, alignItems: 'center' }}>
                                    <CustomImage source={assets.school_background} style={{ position: 'absolute', width: 200, height: 70, resizeMethod: 'cover' }} />
                                    <View style={{ backgroundColor: '#00000030', position: 'absolute', width: 200, height: 70 }} />
                                    <MediumText white h3>{item}</MediumText>
                                </View>
                            </TouchableOpacity>
                        }
                    />



                }

                {section.type === 'friends' &&




                    <UserItem
                        useCase={'friend'}
                        item={item}
                    />
                }

                {section.type === 'study buddies' &&

                    <View style={{ marginHorizontal: 15 }}>

                        <FlatList
                            horizontal

                            data={item}
                            renderItem={({ item }) => <UserItem
                                useCase={'study buddy'}
                                item={item}



                            />}
                        />

                    </View>}


            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

            {renderHeader ? renderHeader(selected) :

                <Header
                    title={title}


                    direction={direction || 'vertical'}
                    headerRight={headerRight && headerRight()}

                />
            }
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="height">
                <View style={{ flex: 1 }}>


                    <View style={{ paddingHorizontal: 15 }}>


                        {renderTextInput ? renderTextInput(selected) :

                            <StyledTextInput
                                icon={<Image
                                    source={assets.search}
                                    style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }} />
                                }
                                value={search}
                                placeholder={placeholder}
                                onChangeText={(value) => {
                                    setSearch(value);
                                    handleSearch(value);
                                    setNewItem({
                                        name: value,
                                        type,
                                        icon: getDefaultImage(type)


                                    });

                                }}

                            />
                        }
                    </View>

                    {renderFilters && <View style={{ marginVertical: 20 }}>
                        {renderFilters()}
                    </View>}


                    {
                        InfoComponent
                    }


                    <View style={{ marginTop: 10 }}>


                        {canCreateNewItem && newItem?.name &&
                            <SectionItem
                                item={newItem}
                                index={0}
                                section={{ type: 'chats' }} />}
                    </View>
                    <View style={{ marginTop: 20 }}>

                        {!isEmpty() ?
                            <SectionList
                                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
                                sections={sections}

                                ListHeaderComponent={
                                    ListHeaderComponent &&
                                    <View style={{ marginVertical: 20 }}>
                                        {ListHeaderComponent}

                                    </View>
                                }
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index, section }) => (
                                    section.visible &&
                                    <SectionItem section={section} item={item} index={index} />
                                )}
                                renderSectionHeader={({ section }) => (
                                    section.visible &&
                                    <SectionHeader section={section} />
                                )}
                                ListFooterComponent={<View style={{ margin: InfoComponent ? 200 : 100 }} />}

                            />
                            :
                            <MediumText darkgray h4 style={{ alignSelf: 'center', marginTop: 40 }}>{"No results"}</MediumText>


                        }

                    </View>

                    {selected.length > 0 &&
                        <View style={{ bottom: 0, width: '100%', height: 120, backgroundColor: Colors.accent, position: 'absolute', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>

                            <ScrollView

                                horizontal

                                showsHorizontalScrollIndicator={false}

                            >
                                {selected.map((item, index) => (


                                    <View
                                        key={index}
                                        style={{ maxWidth: 150, justifyContent: 'space-between', height: 40, marginRight: 5, backgroundColor: '#00000020', padding: 5, paddingRight: 10, borderRadius: 25, flexDirection: 'row', alignItems: 'center' }}>

                                        <ProfileButton
                                            imageURL={item?.photoURL}
                                            defaultImage={item?.icon || getDefaultImage(item?.type || 'private')}
                                            size={30}
                                            emoji={item?.emoji}
                                            colors={item?.colors}
                                        />


                                        <RegularText white numberOfLines={1} style={{ marginLeft: 10, width: 55 }}>

                                            {item?.name || item?.displayName}
                                        </RegularText>
                                        <TouchableWithoutFeedback onPress={() => deselect(item)}>


                                            <Image source={assets.close} style={{ tintColor: Colors.white, width: 20, height: 20, }} />

                                        </TouchableWithoutFeedback>
                                    </View>
                                ))}

                            </ScrollView>



                            {renderButton ? renderButton(selected) :

                                <Button
                                    activeOpacity={0.5}
                                    animationEnabled={false}
                                    colors={['#ffffff20', '#ffffff20']}
                                    loading={loading}
                                    title={renderSubmitButtonTitle ? renderSubmitButtonTitle(selected) : submitButtonTitle || 'Done'}
                                    style={{

                                        ...buttonStyle
                                    }}
                                    onPress={() => onSubmit(selected)}

                                />

                            }
                        </View>}
                </View>
            </KeyboardAvoidingView>
        </View>
    )

}
const mapStateTopProps = store => ({
    currentUser: store.userState.currentUser,
    chats: store.userChatsState.chats,
})



export default connect(mapStateTopProps)(Search)