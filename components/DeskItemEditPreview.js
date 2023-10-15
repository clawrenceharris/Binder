import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { assets, Colors } from '../constants';
import useColorScheme from '../hooks/useColorScheme';
import FlippableFlashcard from './FlippableFlashcard';
import { MediumText } from './StyledText';
import CustomImage from './CustomImage';
import { SHADOWS } from '../constants/Theme';


const DeskItemEditPreview = ({ type, item, media, onRemovePress, style, containerStyle }) => {
    const colorScheme = useColorScheme();
    return (
        <View style={[{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', ...SHADOWS[colorScheme], ...containerStyle }]}>

            {type == "Flashcards" &&

                <FlippableFlashcard

                    width={240}
                    height={150}
                    card={item}
                />


            }


            {type != "Flashcards" && type != "Game" &&
                <View style={[styles.mainContainer, { ...style }]}>
                    <View style={styles.fileContainer}>

                        <CustomImage source={{ uri: media }} style={{ width: '100%', height: '100%' }} />
                        <TouchableOpacity
                            onPress={onRemovePress}
                            style={[styles.removeButton, { right: 10, top: 10, position: 'absolute' }]}>
                            <CustomImage source={assets.trash} style={{ width: 15, height: 15, tintColor: 'white' }} />
                        </TouchableOpacity>
                    </View>

                </View>}
            {type == "Game" &&
                <View style={[styles.cardContainer, { padding: 10, backgroundColor: Colors.white, ...style }]}>
                    {item.question ?
                        <MediumText h5 numberOfLines={4} style={{ textAlign: 'center' }}>{item.question}</MediumText>
                        :
                        <CustomImage source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMethod: 'contain' }} />
                    }
                    <TouchableOpacity
                        onPress={onRemovePress}
                        style={[styles.removeButton, { right: 10, top: 10, position: 'absolute' }]}>
                        <CustomImage source={assets.trash} style={{ width: 15, height: 15, tintColor: 'white' }} />
                    </TouchableOpacity>
                </View>


            }
            {
                type == "Flashcards" &&
                <TouchableOpacity
                    onPress={onRemovePress}
                    style={[styles.removeButton]}>
                    <CustomImage source={assets.trash} style={{ width: 15, height: 15, tintColor: 'white' }} />
                </TouchableOpacity>
            }




        </View >
    )
}
const styles = StyleSheet.create({
    mainContainer: {

        borderRadius: 15



    },
    cardContainer: {

        height: 150,
        backgroundColor: '#00000010',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',


    },
    topRightContainer: {

    },
    fileContainer: {
        width: 150,
        height: 150,
        backgroundColor: '#00000010',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'row',
    },



    removeButton: {

        backgroundColor: '#00000080',
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },




})
export default DeskItemEditPreview