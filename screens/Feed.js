import {
    View,
    FlatList,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    RefreshControl,
    ImageBackground,
    Image

} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, assets } from '../constants'
import { SHADOWS } from '../constants/Theme'
import useColorScheme from '../hooks/useColorScheme'
import Header from '../components/Header'
import { auth, db } from '../Firebase/firebase'
import Button from '../components/Button'
import { mainContainerStyle } from '../GlobalStyles'
import firebase from 'firebase/compat'
import Post from '../components/Post'
import { connect } from 'react-redux'
import { BoldText, MediumText, RegularText } from '../components/StyledText'
import { getDefaultImage, getItemLayout, haptics, isSelected } from '../utils'
import SlideModal from '../components/SlideModal'
import OptionsList from '../components/OptionsList'
import FilterButton from '../components/FilterButton'
import { ActivityIndicator } from 'react-native-paper'
import { fetchPosts, fetchUserChatrooms, fetchUserChats } from '../redux/actions'
import { bindActionCreators } from 'redux'
import { ProfileButton } from '../components'
import { StatusBar } from 'expo-status-bar'
import CustomImage from '../components/CustomImage'
import { getPostRef } from '../services/post'
import { fetchPostComments } from '../services/feed'

const Feed = (props) => {

    const colorScheme = useColorScheme()
    const [refreshing, setRefreshing] = useState(false);
    const { users, navigation, route, school, currentUser, ids, chatrooms } = props;
    const chatroom = props.route?.params?.chatroom;
    const [posts, setPosts] = useState([]);
    const [results, setResults] = useState([]);
    const classes = chatrooms.filter(item => item.type == 'class');
    const [noResultsText, setNoResultsText] = useState('');


    useEffect(() => {

        setResults(props.posts);
        setPosts(props.posts);
    }, [])

    //the filter buttons that appear above the posts
    const filterButtons = [
        {
            text: 'Hot',
            id: school?.id + '1',
            imageURL: assets.fire.uri

        },

        {
            text: 'New',
            imageURL: assets.clock.uri,
            id: school?.id + '2',
        },

        {
            text: 'Top',
            imageURL: assets.chart.uri,
            id: school?.id + '3',

        },
        {
            text: school?.name,
            imageURL: getDefaultImage('school'),
            id: school?.id


        },
        {
            text: classes[0]?.name,
            imageURL: getDefaultImage('class'),
            id: classes[0]?.id,
            more: classes?.map(item => ({
                text: item.name,
                imageURL: getDefaultImage('class'),
                id: item.id
            }))
        },
    ]


    //the active filter button
    const [selectedFilter, setSelectedFilter] = useState(null)

    const filterByClassOrSchool = (item) => {
        setNoResultsText('No posts have been made to ' + item.text)


        setResults(posts.filter(post => post.chatroomId == item.id)
            .sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
            .map(post => post))

    }

    const filterByRecent = () => {
        setNoResultsText('No posts have been made in the last 24 hours')
        const MILLIS_IN_A_DAY = 1000 * 60 * 60 * 24
        const now = new Date()
        const recentDate = new Date(now.getTime() - MILLIS_IN_A_DAY)


        setResults(posts.filter(post => post.createdAt.toDate() >= recentDate)
            .map(post => post))

    }

    const filterByComments = () => {
        setNoResultsText("Nothing's hot yet")




        setResults(posts.filter(post => (post.comments / users.length) * 100 > users.length * 0.3)
            .sort((a, b) => a.comments < b.comments ? 1 : -1)
            .map(post => post))

    }

    const filterByVotes = () => {
        setNoResultsText("Nothing popular yet")



        setResults(posts.filter(post => (post.votes.length / users.length) * 100 > users.length * 0.3)
            .sort((a, b) => a.votes.length < b.votes.length ? 1 : -1)
            .map(post => post))


    }


    const onGroupProfileButtonPress = (item) => {
        navigation.navigate('ChatroomProfile', { id: item.chatroomId })

    }

    const onLikePress = (item, increment) => {
        haptics('light')
        db
            .collection('feed')
            .doc(item.id)
            .update({
                likeCount: firebase.firestore.FieldValue.increment(increment)

            }).then(() => {
                console.log("voted")
            }).catch((e) => {
                console.warn(e)
            })


    }



    const onMorePress = (item) => {

    }



    const getUser = (item) => {
        return users.filter(user => user.uid == item.uid)[0]
    }

    const onCommentPress = (post) => {
        navigation.navigate('Comments', {


            post,
            chatroom: chatrooms.find(chatroom => chatroom.id == post.chatroomId),
            postId: post.id,
            collectionPath: 'feed',
            user: getUser(post),
            onLikePress,
            onMorePress,

        })

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
            if (item.id == school.id || currentUser.classes.includes(item.id)) {
                filterByClassOrSchool(item)
            }

            else if (item.text == 'New') {
                filterByRecent()
            }

            else if (item.text == 'Hot') {
                filterByComments()
            }
            else if (item.text == 'Top') {
                filterByVotes()
            }

            else {
                setNoResultsText("No posts have been made.")

                setResults(posts.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1))
            }


        }
        else {

            setSelectedFilter(null)
            setResults(posts.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1))



        }


    }

    const onRefresh = () => {
        props.fetchUserChats();
        setResults(props.posts.filter(post => ids.includes(post.chatroomId)));
        setPosts(props.posts.filter(post => ids.includes(post.chatroomId)));
        filter(selectedFilter);
    }

    const ListHeaderComponent = () => {
        return (
            <View style={{ padding: 15 }}>



                <View style={{ marginVertical: 20 }}>
                    <FlatList
                        getItemLayout={getItemLayout}
                        numColumns={3}
                        data={filterButtons}

                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>


                            <FilterButton
                                item={item}
                                style={{ marginBottom: 10 }}
                                otherItem={isFilterSelected(item) && item?.more && selectedFilter}
                                isSelected={isFilterSelected(item)}
                                onPress={(item) => filter(item)}

                            />
                        }
                    />

                </View>
            </View>
        )
    }
    if (!posts) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

                <View
                    style={{ ...mainContainerStyle }}>


                    <View style={{ marginVertical: 20 }}>
                        <FlatList
                            getItemLayout={getItemLayout}
                            numColumns={4}
                            data={filterButtons}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) =>
                                <FilterButton
                                    item={''}
                                    style={{ marginBottom: 10 }}
                                    isSelected={false}

                                />
                            }
                        />

                    </View>



                </View>
                <ActivityIndicator color={Colors.accent} />

            </View>

        )
    }

    return (
        <View style={{ flex: 1 }}>

            <SlideModal
                showModal={false}
                onCancel={() => { }}
                toValue={Dimensions.get('window').height - (2 * 120)}
            >
                <OptionsList
                    options={['Report', 'Leave Class']}
                    onOptionPress={[]}
                    onCancel={() => { }}




                />
            </SlideModal>



            <View style={{ ...mainContainerStyle, backgroundColor: Colors[colorScheme].background, padding: 0 }}>


                <View style={{ height: '100%', marginTop: 10 }}>

                    <FlatList
                        refreshControl={
                            <RefreshControl
                                tintColor={Colors[colorScheme].darkGray}
                                refreshing={false}
                                title=''
                                onRefresh={onRefresh} />

                        }
                        ListHeaderComponent={<ListHeaderComponent />}
                        style={{ marginBottom: 180 }}
                        ListEmptyComponent={<View style={{ marginHorizontal: 15, ...SHADOWS[colorScheme], height: 200 }}>
                            <View style={{ backgroundColor: Colors[colorScheme].invertedTint, height: '50%', borderTopRightRadius: 15, borderTopLeftRadius: 15 }}>
                                <CustomImage source={assets.school_background2} style={{ width: '100%', height: '100%' }} />
                                <View style={{ position: 'absolute', backgroundColor: '#00000010', height: '100%', width: '100%', borderTopRightRadius: 15, borderTopLeftRadius: 15 }} />

                            </View>
                            <View style={{ padding: 10, backgroundColor: Colors[colorScheme].invertedTint, height: '50%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
                                <BoldText h5 style={{ marginBottom: 5 }} >{"Post what's on your mind!"}</BoldText>
                                <RegularText darkgray>{noResultsText + ". Be the first to post to your school, class or group feed."}</RegularText>

                            </View>
                        </View>}
                        showsVerticalScrollIndicator={false}
                        data={results}
                        renderItem={({ item }) =>
                            <View style={{ marginHorizontal: 15 }}>


                                <Post
                                    post={item}
                                    chatroom={chatrooms.find(chatroom => chatroom.id == item.chatroomId)}
                                    user={getUser(item)}
                                    onGroupProfileButtonPress={() => onGroupProfileButtonPress(item)}
                                    onLikePress={(increment) => onLikePress(item, increment)}
                                    onUnvotePress={() => onUnvotePress(item)}
                                    onCommentPress={() => onCommentPress(item)}
                                    onMorePress={() => onMorePress(item)}
                                    onProfileButtonPress={() => navigation.navigate('Profile', { uid: getUser(item).uid })}

                                />




                            </View>

                        }
                    />




                </View>



            </View>

            <Button
                style={{ width: 60, height: 60, position: 'absolute', bottom: 120, right: 20, ...SHADOWS[colorScheme] }}
                icon={
                    <CustomImage source={assets.write} style={{ width: 28, height: 28, tintColor: Colors.white }} />}
                onPress={() => props.navigation.navigate('NewPost', { chatroom: chatroom || null })}
            />
        </View>
    )
}

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

    }
})
const mapStateToProps = (store) => ({
    users: store.usersState.users,
    school: store.schoolState.school,
    currentUser: store.userState.currentUser,
    posts: store.feedState.posts,
    chatrooms: store.userState.chatrooms
})

const mapDispatchProps = (dispatch) =>
    bindActionCreators({
        fetchUserChats
    }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Feed)

