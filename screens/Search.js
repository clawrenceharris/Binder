import {
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import useColorScheme from '../hooks/useColorScheme'
import { assets, Colors } from '../constants'
import Header from '../components/Header'
import { connect, useSelector } from 'react-redux'
import UserListItem from '../components/UserListItem'
import { SHADOWS } from '../constants/Theme'
import StyledTextInput from '../components/StyledTextInput'
import { ProfileButton } from '../components'
import { StudyBuddyBadge } from '../components/ProfileBadges'
import { getItemLayout, getResultsFromFilter, getResultsFromSearch } from '../utils'
import { bindActionCreators } from 'redux'
import SearchComponent from '../components/Search'
import { fetchUserChats } from '../redux/actions/chats'
import { fetchUserFriends, fetchUserStudyBuddies } from '../redux/actions/user'
import { fetchSchoolUsers } from '../redux/actions/school'
import SearchFilters from '../components/SearchFilters'
import { MediumText, RegularText } from '../components/StyledText'
import { useFriends } from '../hooks/useFriends'
import CustomImage from '../components/CustomImage'
const Search = (props) => {
    const colorScheme = useColorScheme();
    const chats = useSelector(state => state.userChatsState.chats);
    const users = useSelector(state => state.usersState.users);
    const school = useSelector(state => state.schoolState.school);
    const studyBuddies = useSelector(state => state.userState.studyBuddies);
    const friends = useSelector(state => state.userState.friends);

    const classes = chats.filter(item => item.type == 'class');
    const groups = chats.filter(item => item.type == 'group' || item.type == 'club');
    const schools = chats.filter(item => item.type == 'school');
    const [search, setSearch] = useState('');

    const [selectedFilter, setSelectedFilter] = useState(null);
    const [showHeaderComponent, setShowHeaderComponent] = useState(true);
    const notifications = useSelector(state => state.notificationsState.notifications);
    const onRefresh = () => {
        props.fetchSchoolUsers();
        props.fetchUserChats();

    }


    console.log(studyBuddies)


    const getData = (data, type) => {
        if (selectedFilter) {


            if (selectedFilter == type)
                return data;

            else
                return [];

        }


        return getResultsFromSearch(data, search);
    }
    const sections = [
        {
            title: 'Study Buddies',
            data: [getData(studyBuddies, 'Study Buddies')],
            type: 'study buddies',
            visible: true

        },
        {
            title: 'Friends',
            data: getData(friends, 'Friends'),
            type: 'users',
            visible: true

        },
        {
            title: 'Schools',
            data: getData(schools, 'Schools'),
            type: 'chats',
            visible: true
        },
        {
            title: 'Classes',
            data: getData(classes, 'Classes'),
            type: 'chats',
            visible: true
        },

        {
            title: 'Groups & Clubs',
            data: getData(groups, 'Groups & Clubs'),
            type: 'chats',
            visible: true
        },
        {
            title: school.name + ' Students',
            data: getData(users, 'All Students'),
            type: 'users',
            visible: true
        },



    ]

    const headerLeft = () => (
        <TouchableWithoutFeedback
            onPress={() => { props.navigation.navigate('Notifications') }}>
            <View style={[styles.headerButton, {

                backgroundColor: Colors[colorScheme].lightGray,
            }]}>
                <CustomImage source={assets.bell} style={{ width: 25, height: 25, tintColor: Colors[colorScheme].darkGray }} />

                {notifications.some(item => item.isSeen == false) &&
                    <View style={[styles.badgeContainer, { backgroundColor: Colors[colorScheme].background }]}>
                        <View style={styles.badge} />

                    </View>}

            </View>
        </TouchableWithoutFeedback>

    )



    const handleSearch = (search) => {
        setSearch(search);

    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <SearchComponent
                title={'Search'}
                search={search}
                onTaskError={props.onTaskError}
                onTaskStart={props.onTaskStart}
                onTaskComplete={props.onTaskComplete}
                renderHeader={() => <Header
                    headerLeft={headerLeft()}
                    headerRightStyle={{ width: 0 }}
                    headerLeftStyle={{ width: 60 }}
                    headerCenter={

                        <StyledTextInput

                            placeholder={"Search Binder"}
                            value={search}
                            onChangeText={handleSearch}
                            icon={<CustomImage
                                source={assets.search}
                                style={{ width: 20, height: 20, tintColor: Colors[colorScheme].veryDarkGray }} />
                            }
                        />
                    }
                />}
                handleSearch={handleSearch}
                renderTextInput={() => <></>}
                placeholder={'Search students & communities'}
                collectionPath={'users'}
                renderFilters={() =>
                    <SearchFilters
                        setSelectedFilter={setSelectedFilter}
                        selectedFilter={selectedFilter} />}
                InfoComponent={
                    showHeaderComponent &&
                    <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent + '50', borderRadius: 15, padding: 15, paddingHorizontal: 24 }}>

                        <CustomImage source={assets.search} style={{ width: 35, height: 35, tintColor: Colors.accent }} />
                        <View style={{ marginLeft: 10, width: '90%' }}>
                            <MediumText h4>Discover Communities & Classmates</MediumText>
                            <RegularText darkgray style={{ marginTop: 10 }}>Find your friends, study buddies, and communities!</RegularText>
                        </View>

                        <TouchableOpacity style={{ position: 'absolute', top: 15, right: 15, }} onPress={() => setShowHeaderComponent(false)}>


                            <CustomImage source={assets.close} style={{ width: 15, height: 15, tintColor: Colors[colorScheme].veryDarkGray }} />
                        </TouchableOpacity>
                    </View>
                }
                isSelectable={false}
                sections={sections}
                onRefresh={onRefresh}
                canCreateNewItem={false}

            />





        </View>

    )
}

const styles = StyleSheet.create({
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: 'center',
        padding: 5,
        justifyContent: 'center',
    },

})
const mapDispatchProps = (dispatch) =>
    bindActionCreators({
        fetchSchoolUsers,
        fetchUserChats,


    }, dispatch)

export default connect(null, mapDispatchProps)(Search)