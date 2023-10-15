import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'

import Search from '../components/Search'
import { getResultsFromSearch } from '../utils'
import { connect, useSelector } from 'react-redux'

import { bindActionCreators } from 'redux'
import { fetchChats } from '../redux/actions/chats'

const SelectChats = (props) => {
    const {
        renderSubmitButtonTitle,
        onSubmit,
        title,
        submitButtonTitle,
        placeholder,
        selectionLimit,
        type,
        canCreateNewItem,
        data,
        useCase


    } = props.route.params;
    const colorScheme = useColorScheme();
    const chats = data || props.chats

    const [results, setResults] = useState(chats)
    const sections = [
        {
            title: 'Schools',
            data: data,
            type: 'chats',
            visible: true
        }
    ]
    const handleSearch = (search) => {
        setResults(getResultsFromSearch(chats, search))
    }

    const handleSubmit = (selected) => {
        props.navigation.goBack();
        setTimeout(() => {
            onSubmit(selected);
        }, 100);

    }
    useEffect(() => {
        props.fetchChats();


    }, [])
    const onRefresh = () => {
        props.fetchChats();
    }
    return (

        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>



            <Search
                isSelectable
                onRefresh={onRefresh}
                title={title}
                placeholder={placeholder}
                selectionLimit={selectionLimit}
                submitButtonTitle={submitButtonTitle}
                onSubmit={handleSubmit}
                handleSearch={handleSearch}
                sections={sections}
                type={type}
                useCase={useCase}
                canCreateNewItem={canCreateNewItem}
                renderSubmitButtonTitle={renderSubmitButtonTitle}

            />


        </View>
    )

}


const mapStateToProps = store => ({
    chats: store.chatsState.chats,
    userChats: store.userChatsState.chats
})
const mapDispatchProps = dispatch => bindActionCreators({ fetchChats }, dispatch)


export default connect(mapStateToProps, mapDispatchProps)(SelectChats)