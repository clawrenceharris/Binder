import { View, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants'
import { auth } from '../Firebase/firebase'
import useColorScheme from '../hooks/useColorScheme'
import { useSelector } from 'react-redux'
import { getResultsFromSearch } from '../utils'
import Search from '../components/Search'
import SearchFilters from '../components/SearchFilters'


const SelectUsers = (props) => {
    const school = useSelector(state => state.schoolState.school);
    const _users = useSelector(state => state.usersState.users);
    const users = _users.filter(user => user.uid != auth.currentUser.uid);
    const [usersResults, setUsersResults] = useState(users);
    const [search, setSearch] = useState('');
    const { renderSubmitButtonTitle, onSubmit, title, submitButtonTitle, headerRight } = props.route.params;
    const colorScheme = useColorScheme();
    const currentUser = useSelector(state => state.userState.currentUser);
    const studyBuddies = useSelector(state => state.userState.studyBuddies);
    const friends = useSelector(state => state.userState.friends);
    const [studyBuddyResults, setStudyBuddyResults] = useState(studyBuddies);
    const [friendsResults, setFriendsResults] = useState(friends);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const handleSubmit = (selected) => {
        props.navigation.goBack();
        setTimeout(() => {
            onSubmit(selected);
        }, 100);

    }

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
            title: school.name + " Students",
            data: usersResults,
            type: 'users',
            visible: true

        }

    ]

    const setResults = (value) => {
        setUsersResults(value);
        setStudyBuddyResults(value);
        setFriendsResults(value);
    }
    const resetResults = () => {
        setUsersResults(users);
        setStudyBuddyResults(studyBuddies);
        setFriendsResults(friends);
    }
    useEffect(() => {
        setSearch('')
        setResults([]);

        if (selectedFilter == 'Study Buddies') {

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
        if (selectedFilter == 'All Students')
            setUsersResults(getResultsFromSearch(users, search));

        else if (selectedFilter == 'Frineds')
            setFriendsResults(getResultsFromSearch(friends, search));

        else if (selectedFilter == 'Study Buddies')
            setStudyBuddyResults(getResultsFromSearch(studyBuddies, search));
    }


    return (

        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

            <Search
                isSelectable
                title={title}
                renderFilters={() => <SearchFilters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />}
                placeholder={'Find classmates'}
                selectionLimit={10}
                type={'user'}
                submitButtonTitle={submitButtonTitle}
                headerRight={headerRight}
                onSubmit={handleSubmit}
                handleSearch={handleSearch}
                sections={sectionListData}
                canCreateNewItem={false}
                renderSubmitButtonTitle={renderSubmitButtonTitle}
                profileButtonDisabled

            />


        </View>
    )

}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        fontSize: 20,
        padding: 10,
        fontFamily: 'Kanit',
        color: 'white',
        backgroundColor: '#00000010',
        borderRadius: 15
    },

})




export default SelectUsers