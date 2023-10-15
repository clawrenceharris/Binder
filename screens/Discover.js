import { View, Text, FlatList, TouchableWithoutFeedback, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../constants'
import Header from '../components/Header'
import StyledTextInput from '../components/StyledTextInput'
import { connect, useDispatch } from 'react-redux'
import Search from '../components/Search'
import { bindActionCreators } from 'redux'
import { addUserToChat, getChatByUids, joinChat } from '../services/chats'
import { getErrorMessage, getResultsFromSearch } from '../utils'
import Button from '../components/Button'
import CustomImage from '../components/CustomImage'
import { SHADOWS } from '../constants/Theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MediumText } from '../components/StyledText'
import { auth } from '../Firebase/firebase'
import SlideModal from '../components/SlideModal'
import { ConfirmationModal } from '../components/Modals'
import { fetchSchoolChats } from '../redux/actions/school'

const Discover = (props) => {
    const colorScheme = useColorScheme();
    const { chats } = props;
    const [loading, setLoading] = useState(false);
    const classes = chats.filter(item => item.type == 'class');
    const groups = chats.filter(item => item.type == 'group');
    const schools = chats.filter(item => item.type == 'school');
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const sections = [
        {
            title: 'Classes',
            data: getResultsFromSearch(classes, search),
            type: 'chats',
            visible: true
        },

        {
            title: 'Clubs & Groups',
            data: getResultsFromSearch(groups, search),
            type: 'chats',
            visible: true
        },
        {
            title: 'Schools',
            data: getResultsFromSearch(schools, search),
            type: 'chats',
            visible: true
        }
    ];


    const onRefresh = () => {

        props.fetchSchoolChats();
    }
    const onSubmit = (selected) => {

        setLoading(true);
        selected.forEach(item => {
            addUserToChat(item.id)
                .then(() => {
                    setLoading(false);
                    props.navigation.goBack();


                })
                .catch((e) => props.onTaskError(getErrorMessage(e)))
        })
    }

    const onCreatePress = () => {
        props.navigation.navigate('SelectUsers', {
            title: 'Add Members',
            headerRight: () => (
                <MediumText
                    darkgray
                    h5
                    onPress={() => {
                        props.navigation.pop();
                        goToEditChat([auth.currentUser.uid])
                    }}>
                    {"Skip"}
                </MediumText>),
            onSubmit: (users) => {
                setUsers(users);
                const uids = [...users.map(user => user.uid), auth.currentUser.uid]
                getChatByUids(uids)
                    .then(chat => {
                        if (chat)
                            setShowModal(true);
                        else {
                            goToEditChat(uids);
                        }
                    })
            }
        });
    }

    const goToEditChat = (users) => {
        props.navigation.navigate('EditChat', {
            useCase: 'new group',
            users
        })
    }
    return (
        <View style={{ backgroundColor: Colors[colorScheme].background, flex: 1 }}>

            <SlideModal toValue={0.5} showModal={showModal} onCancel={() => setShowModal(false)}>
                <ConfirmationModal
                    onCancelPress={() => setShowModal(false)}
                    confirmText={"Continue"}
                    onConfirmPress={() => {
                        setShowModal(false);
                        goToEditChat();
                    }}
                    message={"Continue creating this community? A community with the same users already exists."} />
            </SlideModal>
            <Search
                direction={'horizontal'}
                profileButtonDisabled={false}
                renderHeader={() =>
                    <Header
                        title={"Discover"}
                        headerRight={<MediumText accent h5 onPress={onCreatePress}>Create</MediumText>}
                        headerRightStyle={{ width: 55 }}
                        headerLeftStyle={{ width: 55 }}
                    />

                }
                navigation={props.navigation}
                title={'Discover'}
                placeholder={'Find communities'}
                collectionPath={'classesResults'}
                selectionLimit={1}
                sections={sections}
                handleSearch={setSearch}
                onRefresh={onRefresh}
                useCase="new chat"
                loading={loading}
                isSelectable
                onSubmit={onSubmit}
                canCreateNewItem={false}
                renderSubmitButtonTitle={(selected) => selected.length > 1 ? "Join " + selected.length + " chats" : "Join"}

            />


        </View>
    )
}

const mapStateToProps = store => ({
    chats: store.schoolState.chats,
    users: store.usersState.users,
    school: store.schoolState.school
})

const mapDispatchProps = dispatch => bindActionCreators({ fetchSchoolChats }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Discover)