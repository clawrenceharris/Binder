import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../constants';
import { StyleSheet } from 'react-native';
import { SHADOWS } from '../constants/Theme';
import { getDisplayNameOrYou, haptics } from '../utils';
import ProfileButton from './ProfileButton';
import useColorScheme from '../hooks/useColorScheme';
import { auth, db } from '../Firebase/firebase';
import { BoldText, MediumText, RegularText } from './StyledText';
import { ActivityIndicator } from 'react-native-paper';
import CustomImage from './CustomImage';
import { useNavigation } from '@react-navigation/native';
import { bookmarkDeskItem, fetchDeskItem, getLikeById, likeDeskItem, unlikeDeskItem, updateDeskItemLikes } from '../services/desk';
import { useSelector } from 'react-redux';
import { useDeskItems } from '../hooks/useDeskItems';
import { useUsersDeskItems } from '../hooks/useUsersDeskItems';
import { addNotification } from '../services/notifications';


const { width } = Dimensions.get('window');

const DeskItemThumbnail = ({
    useCase,
    selectionMode,
    deskItem,
    onMorePress,
    onLongPress,
    onLockPress,
    onPress,
    user,
    isSelected,
    onTaskError,
    style }) => {


    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [currentLikeState, setCurrentLikeState] = useState({
        state: deskItem?.likes?.includes(auth.currentUser.uid),
        count: deskItem?.likes?.length || 0
    });
    const onLikePress = () => {
        haptics('light');

        if (currentLikeState.state == true) {
            setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
            unlikeDeskItem(deskItem.id, deskItem.uid)


                .catch((e) => {
                    onTaskError(e.message);
                    setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
                });

        }
        else {
            setCurrentLikeState({ state: true, count: currentLikeState.count + 1 })
            likeDeskItem(deskItem.id, deskItem.uid)
                .then(() => {
                    if (currentUser.uid != deskItem.uid)
                        addNotification(
                            deskItem.uid,
                            currentUser.uid,
                            currentUser.displayName,
                            'liked your ' + deskItem.type,
                            'desk item like',
                            { name: 'DeskItem', params: { deskItem: deskItem } })
                })

                .catch((e) => {

                    onTaskError(e.message);
                    setCurrentLikeState({ state: false, count: currentLikeState.count - 1 })
                });
        }
    }


    const BottomActionButton = ({ source, count, onCountPress, onPress, imageStyle, activeOpacity, style }) => {
        return (
            <TouchableOpacity
                activeOpacity={activeOpacity || 1}
                onPress={onPress}

                style={{ flexDirection: 'row', alignItems: 'center', ...style }}>
                <CustomImage

                    source={source}
                    style={{ width: 15, height: 15, marginRight: 5, tintColor: Colors.light.darkGray, ...imageStyle }} />
                {count != null && <RegularText onPress={onCountPress} darkgray>{count}</RegularText>}

            </TouchableOpacity>
        )
    }

    const BottomActionBar = ({ style }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', ...style }}>

                <View style={{ flexDirection: 'row' }}>


                    <BottomActionButton
                        source={assets.view}
                        count={deskItem.views.length}
                        onCountPress={() => navigation.push('Items', { title: 'Views', items: deskItem.views, useCase: 'users' })}

                        onPress={() => navigation.push('Items', { title: 'Views', items: deskItem.views, useCase: 'users' })}
                        style={{ marginRight: 20 }}
                    />
                    <BottomActionButton
                        source={currentLikeState.state ? assets.heart : assets.heart_o}
                        count={currentLikeState.count}
                        onCountPress={() => navigation.push('Items', { title: 'Likes', items: deskItem.likes, useCase: 'users' })}
                        imageStyle={{ tintColor: currentLikeState.state ? Colors.red : Colors.light.darkGray }}
                        onPress={onLikePress}
                    />
                </View>

                {!selectionMode ?
                    <BottomActionButton
                        activeOpacity={0.5}
                        source={assets.more}

                        onPress={onMorePress}
                    />
                    :
                    <View style={{ padding: 8, borderWidth: !isSelected ? 1 : 0, borderColor: Colors[colorScheme].gray, backgroundColor: isSelected ? Colors.accent : 'transparent', borderRadius: 25, alignItems: 'center', justifyContent: 'center', width: 25, height: 25 }}>
                        {isSelected && <CustomImage source={assets.check} style={{ width: 10, height: 10, tintColor: Colors.white }} />}
                    </View>
                }
            </View>
        )
    }
    if (!deskItem?.id) {
        return (
            <View style={[styles.mainContainer, { backgroundColor: Colors[colorScheme].lightGray, alignItems: 'center', justifyContent: 'center', ...style }]}>
                <ActivityIndicator color={Colors.accent} />
            </View>

        )
    }

    if (useCase == 'share' || useCase == 'edit') {
        return (
            <View

                style={[styles.mainContainer, { backgroundColor: Colors[colorScheme].invertedTint, ...SHADOWS[colorScheme], width: 140, height: 170, ...style }]}>

                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <ProfileButton
                            defaultImage={deskItem.isAnonymous && assets.person_gradient.uri}
                            imageURL={deskItem.isAnonymous ? null : deskItem.user?.photoURL}
                            size={25}
                        />
                    </View>


                    <CustomImage
                        source={deskItem.isPublic ? assets.unlock : assets.lock}
                        style={{ tintColor: deskItem.isPublic ? Colors.accent : Colors[colorScheme].darkGray, width: 20, height: 20, position: 'absolute', right: 0 }}


                    />
                </View>

                {deskItem.type != "Flashcards" && deskItem.type != "Game" ?

                    <View style={{ marginBottom: 10, height: 110 }}>

                        <CustomImage source={{ uri: deskItem.media[0] }} style={[styles.image, { borderRadius: 10 }]} />

                        <View style={[styles.imageOverlay, { borderRadius: 10 }]} />

                        <View style={styles.titleContianer}>
                            {deskItem.divisionNumber &&
                                <RegularText white>
                                    {deskItem.divisionType + " " + deskItem.divisionNumber}
                                </RegularText>
                            }
                            <MediumText h4 white style={{ textAlign: 'center' }}>{deskItem.title}</MediumText>
                        </View>




                    </View>
                    :

                    <View>
                        <View style={[styles.flashcardContainer, {
                            ...SHADOWS[colorScheme],
                        }]}>
                            {deskItem.type == "Game" ?
                                <CustomImage source={assets.play} style={{ position: 'absolute', width: '50%', height: '100%', tintColor: Colors.primary + "50" }} />
                                :
                                <CustomImage source={assets.flashcards} style={{ position: 'absolute', width: '50%', height: '100%', tintColor: Colors.accent + "50", transform: [{ rotate: '90deg' }] }} />

                            }
                            {deskItem.divisionNumber != null &&
                                <RegularText darkgray>{deskItem.divisionType + " " + deskItem.divisionNumber}</RegularText>}
                            <MediumText accent={deskItem.type == "Flashcards"} primary={deskItem.type == "Game"} h4 style={{ textAlign: 'center' }}>{deskItem.title}</MediumText>

                        </View>
                    </View>
                }


            </View>




        )
    }
    return (


        <TouchableWithoutFeedback
            onLongPress={onLongPress}
            onPress={() => onPress ? onPress() : navigation.navigate('DeskItem', { deskItem })}
        >


            <View

                style={[styles.mainContainer, { backgroundColor: Colors[colorScheme].invertedTint, ...SHADOWS[colorScheme], ...style }]}>

                <View style={styles.headerContainer}>
                    <ProfileButton
                        defaultImage={deskItem.isAnonymous && assets.person_gradient.uri}
                        imageURL={deskItem.isAnonymous ? null : deskItem.user?.photoURL}
                        size={25}
                    />
                    <TouchableWithoutFeedback onPress={onLockPress}>


                        <CustomImage
                            source={deskItem.isPublic ? assets.unlock : assets.lock}
                            style={{ tintColor: deskItem.isPublic ? Colors.accent : Colors[colorScheme].darkGray, width: 22, height: 22, position: 'absolute', right: 0 }}


                        />
                    </TouchableWithoutFeedback>
                </View>

                {deskItem.type != "Flashcards" && deskItem.type != "Game" ?

                    <View style={{ marginVertical: 10, height: 160 }}>

                        <CustomImage source={{ uri: deskItem.media[0] }} style={[styles.image]} />

                        <View style={styles.imageOverlay} />

                        <View style={styles.titleContianer}>
                            {deskItem.divisionNumber &&
                                <RegularText white>
                                    {deskItem.divisionType + " " + deskItem.divisionNumber}
                                </RegularText>
                            }
                            <MediumText h4 white style={{ textAlign: 'center' }}>{deskItem.title}</MediumText>
                        </View>




                    </View>

                    :

                    <View >
                        <View style={[styles.flashcardContainer, {
                            ...SHADOWS[colorScheme],
                            backgroundColor: Colors[colorScheme].invertedTint
                        }]}>

                            {deskItem.type == "Game" ?
                                <CustomImage source={assets.play} style={{ position: 'absolute', width: '50%', height: '100%', tintColor: Colors.primary + "50" }} />
                                :
                                <CustomImage source={assets.flashcards} style={{ position: 'absolute', width: '50%', height: '100%', tintColor: Colors.accent + "50", transform: [{ rotate: '90deg' }] }} />

                            }
                            {deskItem.divisionNumber != null &&
                                <RegularText darkgray>{deskItem.divisionType + " " + deskItem.divisionNumber}</RegularText>}
                            <MediumText accent={deskItem.type == "Flashcards"} primary={deskItem.type == "Game"} h4 style={{ textAlign: 'center' }}>{deskItem.title}</MediumText>

                        </View>
                    </View>

                }
                <BottomActionBar style={{ bottom: 0 }} />

            </View>

        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },

    mainContainer: {
        borderRadius: 15,
        padding: 10,
        width: (width / 2) - 20,

        height: 260,
        justifyContent: 'space-between'



    },

    blurImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    blurContainer: {
        flex: 1,
        padding: 10,
        paddingBottom: 40,
        justifyContent: 'center',
    },

    publicIcon: {
        width: 20,
        height: 20,


    },


    flashcardContainer: {
        padding: 20,
        width: '100%',
        height: 100,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',

        justifyContent: 'center',

    },

    titleText: {
        textAlign: 'center',
    },

    topContinaer: {
        padding: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    titleContianer: {
        position: 'absolute',
        top: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 15

    },


    profileImage: {
        backgroundColor: 'gray',
        width: 25,
        height: 25,
        marginRight: 10,
        borderRadius: 50
    },

    bottomContainer: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden',



    },

    imageOverlay: {


        position: 'absolute',
        backgroundColor: 'black',
        opacity: 0.2,
        width: '100%',
        height: '100%',
        borderRadius: 15

    }
})
export default DeskItemThumbnail