import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StyledTextInput from '../components/StyledTextInput'
import { assets, Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import { useSelector } from 'react-redux'
import Search from '../components/Search'
import { getErrorMessage, getResultsFromSearch } from '../utils'
import { MediumText } from '../components/StyledText'
import ScaleButton from '../components/ScaleButton'
import { createChat, getChatByUid, getChatByUids, sendMessage } from '../services/chats'
import { auth } from '../Firebase/firebase'
import { useUser } from '../hooks/useUser'
import CustomImage from '../components/CustomImage'
import Header from '../components/Header'
import SpecialChatItem from '../components/SpecialChatItem'
import SearchFilters from '../components/SearchFilters'
import SendButton from '../components/SendButton'

const Share = (props) => {
    const colorScheme = useColorScheme();
    const chats = useSelector(state => state.userChatsState.chats);
    const school = useSelector(state => state.schoolState.school);
    const currentUser = useSelector(state => state.userState.currentUser);
    const _users = useSelector(state => state.usersState.users);
    const users = _users.filter(user => user.uid != auth.currentUser.uid)

    const classes = chats.filter(item => item.type == 'class');
    const schools = chats.filter(item => item.type == 'school');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const groups = chats.filter(item => item.type == 'group' || item.type == 'club');
    const [groupsResults, setGroupsResults] = useState(groups)
    const [usersResults, setUsersResults] = useState(users);
    const [schoolsResults, setSchoolsResults] = useState(schools);
    const [classesResults, setClassesResults] = useState(classes);
    const { message, onSubmit } = props.route.params;
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const specialChatItemUser = useUser(message?.specialChatItem?.uid).data
    const studyBuddies = users.filter(user => currentUser.studyBuddies.includes(user.uid));
    const friends = users.filter(user => currentUser.friends.includes(user.uid));
    const [text, setText] = useState(message.text);

    const [studyBuddyResults, setStudyBuddyResults] = useState(studyBuddies);

    const [friendsResults, setFriendsResults] = useState(friends);

    const sectionListData = [


        {
            title: 'Study Buddies',
            data: [studyBuddyResults],
            type: 'study buddies',
            visible: true

        },
        {
            title: 'Friends',
            data: friendsResults,
            type: 'friends',
            visible: true

        },
        {
            title: 'Schools',
            data: schoolsResults,
            type: 'chats',
            visible: true

        },
        {
            title: 'Classes',
            data: classesResults,
            type: 'chats',
            visible: true

        },
        {
            title: 'Groups & Clubs',
            data: groupsResults,
            type: 'chats',
            visible: true
        },



        {
            title: school.name + " Students",
            data: usersResults,
            type: 'users',
            visible: true

        }

    ]

    const setResults = (value) => {
        setUsersResults(value);
        setGroupsResults(value)
        setStudyBuddyResults(value);
        setFriendsResults(value);
        setClassesResults(value);
        setSchoolsResults(value);
    }
    const resetResults = () => {
        setUsersResults(users);
        setGroupsResults(groups)
        setStudyBuddyResults(studyBuddies);
        setFriendsResults(friends);
        setClassesResults(classes);
        setSchoolsResults(schools);
    }

    useEffect(() => {
        setSearch('')
        setResults([]);

        if (selectedFilter == 'Schools') {
            setSchoolsResults(schools);
        }

        else if (selectedFilter == 'Classes') {
            setClassesResults(classes);

        }
        else if (selectedFilter == 'Groups & Clubs') {
            setGroupsResults(groups);
        }
        else if (selectedFilter == 'Study Buddies') {

            setStudyBuddyResults(studyBuddies);
        }
        else if (selectedFilter == 'All Students') {

            setUsersResults(users);
        }

        else if (selectedFilter == 'Friends') {


            setFriendsResults(friends);
        }
        else {
            resetResults();
        }
    }, [selectedFilter])

    const handleSearch = (search) => {
        setSearch(search);
        if (!search) {
            return resetResults();
        }
        if (selectedFilter == 'Schools') {
            setSchoolsResults(getResultsFromSearch(schools, search));

        }
        else if (selectedFilter == 'Classes')
            setClassesResults(getResultsFromSearch(classes, search));

        else if (selectedFilter == 'All Students')
            setUsersResults(getResultsFromSearch(users, search));
        else if (selectedFilter == 'Groups & Clubs')
            setGroupsResults(getResultsFromSearch(groups, search));
        else if (selectedFilter == 'Frineds')
            setFriendsResults(getResultsFromSearch(friends, search));

        else if (selectedFilter == 'Study Buddies')
            setStudyBuddyResults(getResultsFromSearch(studyBuddies, search));

        else {
            setSchoolsResults(getResultsFromSearch(schools, search));
            setClassesResults(getResultsFromSearch(classes, search));
            setUsersResults(getResultsFromSearch(users, search));
            setFriendsResults(getResultsFromSearch(friends, search));
            setGroupsResults(getResultsFromSearch(groups, search));

            setStudyBuddyResults(getResultsFromSearch(studyBuddies, search));
        }
    }
    const renderHeaderComponent = () => (
        <View style={{ paddingHorizontal: 15 }}>

            <StyledTextInput
                multiline

                value={text}
                onChangeText={setText}
                containerStyle={{ height: 190, borderRadius: 10 }}
                style={{ paddingLeft: 150 }}
                placeholder={"Add a message..."}
                icon={<SpecialChatItem
                    user={specialChatItemUser}
                    message={message}
                    useCase={'share'} />}

            />

        </View>
    )

    const SearchHeader = () => {
        return (
            <Header
                direction={'vertical'}
                headerRightStyle={{ width: 0 }}
                headerCenter={

                    <StyledTextInput
                        placeholder={"Send To..."}
                        value={search}
                        onChangeText={handleSearch}
                        icon={<CustomImage
                            source={assets.search}
                            style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }} />
                        }
                        rightIcon={
                            //if we selected more than one item and each item is a user object
                            selected?.length > 1 && selected.every(item => item?.uid) &&
                            //render the button for creating a group containing the selected users
                            <ScaleButton
                                onPress={() => props.navigation.navigate('EditChat', {
                                    useCase: 'new group',
                                    users: selected.map(item => item.uid).concat(auth.currentUser.uid),
                                    onSubmit: (chat) => {
                                        props.navigation.goBack();
                                        setSelected([chat])
                                        setGroupsResults([...groupsResults, chat])
                                    }

                                })}
                            >
                                <View
                                    style={{ flexDirection: 'row', backgroundColor: Colors.accent, borderRadius: 25, padding: 5, paddingHorizontal: 15, alignItems: 'center' }}>
                                    <View>
                                        <CustomImage source={assets.group} style={{ width: 20, height: 20, tintColor: Colors.white }} />
                                        <CustomImage source={assets.add} style={{ position: 'absolute', width: 10, height: 10, right: -10, tintColor: Colors.white }} />
                                    </View>
                                    <MediumText white h5 style={{ marginLeft: 15 }}>New Group</MediumText>
                                </View>
                            </ScaleButton>
                        }



                    />
                }
            />
        )
    }

    const handleShare = (selected) => {
        props.navigation.goBack();
        props.onTaskStart('Sending...');
        selected.forEach(item => {
            //if the selected item has a uid then get the chat by user's uid
            if (item.uid) {
                getChatByUid(item.uid)
                    .then(chat => {
                        //if a chat does exist, then send the message
                        if (chat) {
                            sendMessage(
                                chat.id,
                                message.contentType,
                                text,
                                message.media,
                                message.specialChatItem)
                                .then(() => {
                                    props.onTaskComplete('Sent!');
                                })
                                .catch((e) => {
                                    props.onTaskError(e);
                                })
                        }
                        //if the chat doesnt exist, create the chat then send the message
                        else {
                            createChat({
                                schoolId: school.id,
                                type: 'private',
                                users: [auth.currentUser.uid, item.uid],

                            })
                                .then((id) => {
                                    sendMessage(
                                        id,
                                        message.contentType,
                                        text,
                                        message.media,
                                        message.specialChatItem)
                                        .then(() => {
                                            props.onTaskComplete('Sent!');
                                        })
                                        .catch((e) => {
                                            props.onTaskError(getErrorMessage(e));
                                        })
                                })

                        }
                    })
            }
            else {
                //if the chat doesnt have a uid then that means its a group chat so send the message using its id
                sendMessage(
                    item.id,
                    message.contentType,
                    text ? text : null,
                    message.media,
                    message.specialChatItem
                )
                    .then(() => {
                        props.onTaskComplete('Sent!');

                    })
                    .catch(e => {
                        props.onTaskError(e);
                    })

            }

        })
        setTimeout(() => {
            onSubmit && onSubmit();
        }, 200);
    }



    return (
        <View style={{ flex: 1 }}>
            <Search
                isSelectable
                direction={'vertical'}
                selected={selected}

                renderHeader={(selected) =>
                    <SearchHeader />
                }
                title={'Share'}
                renderTextInput={() => <></>}
                ListHeaderComponent={
                    message.specialChatItem && !search &&
                    renderHeaderComponent()}
                renderFilters={() => <SearchFilters
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />}
                selectionLimit={10}
                sections={sectionListData}
                canCreateNewItem={false}
                useCase={'share'}
                onSubmit={handleShare}
                renderButton={(selected) => <SendButton
                    colors={[Colors.accent, Colors.accent]}
                    size={50}
                    onPress={() => handleShare(selected)}
                />}
                renderSubmitButtonTitle={(selected) =>
                    selected.length > 1 ?
                        <MediumText h4 white>{"Send Separately"}</MediumText>
                        :
                        <MediumText h4 white>
                            {"Send"}
                        </MediumText>





                }


            />

        </View>
    )
}


export default Share