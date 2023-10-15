import { View, Text, TouchableWithoutFeedback, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { Switch } from 'react-native-paper'
import { MediumText, RegularText } from './StyledText'
import CustomImage from './CustomImage'

const OptionsList = ({ options, onOptionPress, showsIcons, onCancel, ListHeaderComponent }) => {
    const colorScheme = useColorScheme()
    const getIcon = (title) => {

        switch (title) {
            case 'Pin': return assets.thumbtack;
            case 'Bookmark':
            case 'Remove Bookmark':
                return assets.bookmark_o;

            case 'Reply': return assets.reply;
            case 'Delete': return assets.trash;
            case 'Clear Desk': return assets.trash;
            case 'Public': return assets.unlock;
            case 'Leave Group':
            case 'Leave Class':
            case 'Leave Club':
            case 'Leave School': return assets.leave;
            case 'Edit Group':
            case 'Edit Class':
            case 'Edit':

            case 'Edit Club':
            case 'Edit School': return assets.pencil_o;

            case 'Desk Settings': return assets.settings;
            case 'Desk Settings': return assets.settings;
            case 'Take Photo': return assets.camera;
            case 'Upload Photo': return assets.image;

            case 'Mute': return assets.bell;
            case 'Copy': return assets.copy;
            case 'Bookmarked': return assets.bookmark;
            case 'Block': return assets.close

        }
        return null
    }

    const getColor = (title) => {
        switch (title) {

            case 'Delete':
            case 'Clear Desk':
            case 'Leave Group':
            case 'Leave School':
            case 'Leave Class':
            case 'Leave Club':
            case 'Report':

            case 'Block': return Colors.red;
            default: return Colors[colorScheme].tint


        }

    }
    const styles = StyleSheet.create({


        optionContainer: {
            backgroundColor: Colors[colorScheme].invertedTint,
            width: '100%',
            height: 50,
            paddingHorizontal: 15,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        separator: {
            backgroundColor: colorScheme == 'light' ? '#EAEBF1' : Colors[colorScheme].gray,
            width: '100%',
            height: 1

        },
        optionTitle: {
            textAlign: 'center',
            color: Colors[colorScheme].tint,
            fontFamily: 'KanitMedium',
            fontSize: 18,

        },
        doneContainer: {
            backgroundColor: Colors[colorScheme].invertedTint,
            padding: 15,
            width: '100%',
            borderRadius: 15,
            marginTop: 15,
            height: 50,
            alignItems: 'center'
        }


    })
    const title = (item) => {
        return typeof item == 'string' ? item : item.title;
    }
    return (
        <View>


            <FlatList
                ListHeaderComponent={
                    ListHeaderComponent &&
                    <View style={{ justifyContent: 'center', height: 100, padding: 15, borderTopRightRadius: 15, borderTopLeftRadius: 15, backgroundColor: Colors[colorScheme].invertedTint, borderBottomColor: colorScheme == 'light' ? '#EAEBF1' : Colors[colorScheme].gray, borderBottomWidth: 1 }}>

                        {ListHeaderComponent}
                    </View>
                }
                data={options}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item, index }) =>
                    <TouchableWithoutFeedback

                        onPress={() => onOptionPress.length == 1 ? onOptionPress[0](item) : onOptionPress[index](item)}>

                        <View style={[styles.optionContainer, {
                            borderTopRightRadius: index === 0 && !ListHeaderComponent && 15,
                            borderTopLeftRadius: index === 0 && !ListHeaderComponent && 15,
                            borderBottomRightRadius: index === options.length - 1 && 15,
                            borderBottomLeftRadius: index === options.length - 1 && 15


                        }]}>
                            <View style={{ flexDirection: 'row' }}>
                                {(showsIcons == null || showsIcons == true) && getIcon(title(item)) &&

                                    <CustomImage source={getIcon(title(item))} style={{ width: 25, height: 25, tintColor: getColor(item) }} />}

                                <RegularText h5 style={{ color: getColor(title(item)), marginLeft: 10, }}>{title(item)}</RegularText>

                            </View>


                            {item?.rightComponent}

                        </View>
                    </TouchableWithoutFeedback>

                }
                keyExtractor={(item) => title(item)}
            />
            <TouchableWithoutFeedback onPress={onCancel}>

                <View style={styles.doneContainer}>
                    <MediumText h5>Done</MediumText>
                </View>
            </TouchableWithoutFeedback>

        </View>


    )
}

export default OptionsList