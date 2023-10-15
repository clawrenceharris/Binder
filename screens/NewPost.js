import { View, TouchableWithoutFeedback, Image, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Button from '../components/Button'
import StyledTextInput from '../components/StyledTextInput'
import { auth, db } from '../Firebase/firebase'
import Header from '../components/Header'
import firebase from 'firebase/compat'
import { SHADOWS } from '../constants/Theme'
import { mainContainerStyle } from '../GlobalStyles'
import { MediumText } from '../components/StyledText'
import { connect } from 'react-redux'
import { getDefaultImage } from '../utils'
import FilterButton from '../components/FilterButton'
import { updateRecentActivity } from '../services/chats'
import { addPost } from '../services/feed'



const NewPost = (props) => {
    const colorScheme = useColorScheme()
    const [text, setText] = useState('')
    const { userChatrooms, classes } = props
    const [loading, setLoading] = useState(false)


    const [chatrooms, setChatrooms] = useState([]) // the chatrooms the user selected to post to
    const [media, setMedia] = useState([])
    const [deskItem, setDeskItem] = useState(null)
    const [data, setData] = useState([])


    const handleAddPost = (chatroomId) => {

        console.log(chatroomId)
        addPost(
            {
                text,
                media,
                deskItem: deskItem || null,
                uid: auth.currentUser.uid,
                chatroomId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                likeCount: 0,
                reactions: []
            }
        )
            .then(() => {
                setLoading(false)
                updateRecentActivity(chatroomId, "made a post");


            })
            .catch((e) => {
                setLoading(false);
                alert(e.message);
            })
    }


    const onPostPress = () => {
        setLoading(true)

        chatrooms.forEach(chatroom => {
            console.log(chatroom)
        })


    }

    const addMedia = (item) => {
        setMedia([...media, item])
    }
    const onChatroomButtonPress = (item) => {


        if (chatrooms.includes(item)) {
            return setChatrooms(chatrooms.filter(el => el.id != item.id))
            //deselect the current more options replace it with this item




        }
        else {
            return setChatrooms([...chatrooms, item])
        }


    }

    const isChatroomButtonSelected = (item) => {


        return chatrooms.includes(item)

    }
    useEffect(() => {
        setData([
            {
                text: userChatrooms.filter(item => item.type == 'school')[0]?.name,
                imageURL: getDefaultImage('school'),
                chatroomId: userChatrooms.find(item => item.type == 'school').id,
                id: '2',
                // more: userChatrooms.filter(item => item.type == 'school').map(item => ({
                //     text: item.name,
                //     imageURL: item.photoURL,
                //     chatroomId: item.id,
                //     id: '2',
                // }))
            },
            {
                text: classes[0]?.name,
                imageURL: getDefaultImage('class'),
                chatroomId: classes[0]?.id,
                id: '1',
                more: classes.map(item => ({
                    text: item.name,
                    imageURL: getDefaultImage('class'),
                    chatroomId: item.id,
                    id: '1',
                })),

            },

            {

                text: userChatrooms.filter(item => item.type == 'group')[0]?.name,
                imageURL: userChatrooms.filter(item => item.type == 'group')[0]?.photoURL,
                chatroomId: userChatrooms.filter(item => item.type == 'group')[0]?.id,
                id: '0',
                more: userChatrooms.filter(item => item.type == 'group')?.map(item => ({
                    text: item.name,
                    imageURL: item.photoURL,
                    chatroomId: item.id,
                    id: '0',
                }))
            }

        ]

        )


    }, [])

    const styles = StyleSheet.create({
        addChatBtn: {
            bottom: 20,
            right: 20,
            backgroundColor: Colors.accent,
            width: 70,
            height: 70,
            position: 'absolute',
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
        },

        subHeaderTitle: {
            fontFamily: 'KanitMedium',
            fontSize: 16,
            marginLeft: 10
        },
        postIcon: {
            width: 28,
            height: 28,

        },
        postContainer: {
            ...SHADOWS[colorScheme],
            marginTop: 20,
            backgroundColor: Colors[colorScheme].invertedTint,
            padding: 20,
            borderRadius: 15,
        },
        bottomPostContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',

            alignItems: 'center'
        },
        postOptionsContainer: {
            justifyContent: 'space-between',
            width: '50%',
            flexDirection: 'row'
        }
    })




    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background, borderRadius: 40 }}>
            <Header
                title="New Post"
                navigation={props.navigation}
                backButton={assets.close}
            />

            <ScrollView bounces={false}>


                <View style={{ ...mainContainerStyle }}>

                    <MediumText style={{ marginBottom: 10 }} h3>Post To:</MediumText>
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={data}
                            renderItem={({ item }) =>

                                <FilterButton


                                    item={item}
                                    otherItem={isChatroomButtonSelected(item) && item?.more && chatrooms[chatrooms.length - 1]}
                                    onPress={(item) => onChatroomButtonPress(item)}
                                    isSelected={isChatroomButtonSelected(item)}
                                />




                            }
                        />
                    </View>



                    <View style={styles.postContainer}>
                        <StyledTextInput

                            placeholder='Say something...'
                            multiline
                            style={{ color: Colors[colorScheme].tint, height: 100, fontFamily: 'Kanit', fontSize: 16, backgroundColor: Colors[colorScheme].invertedTint }}
                            value={text}
                            onChangeText={setText}
                            containerStyle={{ borderRadius: 15, borderWidth: 0, backgroundColor: Colors[colorScheme].invertedTint }}
                        />

                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal >
                            {
                                media.map((uri, index) => (
                                    <View
                                        key={index.toString()}
                                        style={{ borderRadius: 15, overflow: 'hidden', width: 100, height: 100, marginRight: 10 }}>

                                        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />

                                        <TouchableOpacity
                                            onPress={() => setMedia(media.filter(item => item != uri))}
                                            style={{ backgroundColor: '#00000070', borderRadius: 50, padding: 5, position: 'absolute', top: 5, right: 5 }}>
                                            <Image source={assets.close} style={{ width: 10, height: 10, tintColor: Colors.white }} />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }


                        </ScrollView>

                        <View style={styles.bottomPostContainer}>
                            <View style={styles.postOptionsContainer}>


                                <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Camera', { setMedia: addMedia, useCase: 'post' })}>
                                    <Image source={assets.camera} style={[styles.postIcon, { tintColor: Colors[colorScheme].darkGray }]} />

                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback>
                                    <MaterialCommunityIcons name="image" size={28} color={Colors[colorScheme].darkGray} />

                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback>
                                    <Image source={assets.desk} style={[styles.postIcon, { tintColor: Colors[colorScheme].darkGray }]} />

                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback>
                                    <Image source={assets.horn} style={[styles.postIcon, { tintColor: Colors[colorScheme].darkGray }]} />

                                </TouchableWithoutFeedback>


                            </View>

                            <Button
                                title='Post'
                                disabled={!media.length && !text || chatrooms.length == 0}
                                onPress={onPostPress}
                                loading={loading}
                            />
                        </View>
                    </View>


                </View>
            </ScrollView>
        </View>
    )
}


const mapStateToProps = store => ({
    school: store.schoolState.school,
    userChatrooms: store.userState.chatrooms,
    classes: store.userState.classes

})
export default connect(mapStateToProps)(NewPost)