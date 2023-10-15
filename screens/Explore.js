import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Colors, assets } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Header from '../components/Header'
import StyledTextInput from '../components/StyledTextInput'
import { MediumText } from '../components/StyledText'
import Search from '../components/Search'
import { useDeskItems } from '../hooks/useDeskItems'
import { useSelector } from 'react-redux'
import subjects from '../constants/Subjects'
import CustomImage from '../components/CustomImage'
import { getResultsFromSearch } from '../utils'

const Explore = (props) => {
    const colorScheme = useColorScheme();
    const { deskItems } = useDeskItems();
    const chats = useSelector(state => state.userChatsState.chats);
    const classes = chats.filter(item => item.type == 'class');
    const [search, setSearch] = useState('');
    const games = deskItems.filter(item => item.type == "Game");
    const notes = deskItems.filter(item => item.type == "Notes");
    const flashcards = deskItems.filter(item => item.type == "Flashcards");

    const getAllLikes = () => {
        let likes = [];
        deskItems.forEach(item => {
            likes = likes.concat(item.likes);
        });
        return likes;
    }
    const popular = () => {

        return deskItems.filter(item => {

            return item.likes.length / getAllLikes().length >= 0.7
        });
    }
    const forYou = () => {
        return deskItems.filter(item => {
            const result = classes.map(item => item.id).includes(item.classId) ||
                classes.map(item => item.name.toLowerCase()).indexOf(item.title.toLowerCase()) > -1
            return result
        })
    }
    const getData = (data) => {
        const results = getResultsFromSearch(data, search);
        const filteredData = data.filter((_, index) => index < 6)
        return search ? results.length > 0 ? [results] : [] : data.length ? [filteredData] : [];
    }
    const sections = props.route.params?.sections || [
        {
            title: 'Subjects',
            data: [subjects],
            type: 'subjects',
            visible: !search,
            onPress: (subject) => props.navigation.push('Explore', {
                sections: [{
                    title: subject,
                    data: [deskItems.filter(item => item.subject == subject)],
                    type: 'desk items',
                    visible: true,
                }]
            })
        },


        {
            title: 'For You',
            data: forYou().length ? [forYou().filter((_, index) => index == Math.floor(Math.random() * forYou().length)).filter((_, index) => index < 8)] : [],
            type: 'desk items',
            visible: !search
        },
        {
            title: 'Popular',
            data: popular().length ? [popular()] : [],
            type: 'desk items',
            visible: !search,
            horizontal: true,
            onPress: () => props.navigation.navigate('Items', { title: 'Popular', items: popular(), useCase: 'desk items', })
        },
        {
            title: 'Notes',
            data: getData(notes),
            visible: true,
            type: 'desk items',
            onPress: () => props.navigation.navigate('Items', { title: 'Games', items: notes, useCase: 'desk items', })
        },
        {
            title: 'Flashcards',
            data: getData(flashcards),
            visible: true,
            type: 'desk items',
            onPress: () => props.navigation.navigate('Items', { title: 'Games', items: flashcards, useCase: 'desk items', })
        },
        {
            title: 'Games',
            data: getData(games),
            visible: true,
            type: 'desk items',
            onPress: () => props.navigation.navigate('Items', { title: 'Games', items: games, useCase: 'desk items', })
        }






    ];


    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

            <Search
                title='Explore'
                sections={sections}
                handleSearch={setSearch}
                placeholder={'Search Games, Flashcards and more'}
                isSelectable={false}



            />
        </View>
    )
}

export default Explore