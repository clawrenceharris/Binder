
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../../constants'
import { descriptions, styles } from '.'
import Button from '../../components/Button'
import { auth, db } from '../../Firebase/firebase'
import Header from '../../components/Header'
import firebase from 'firebase/compat/app'

import { ConfirmationModal } from '../../components/Modals'
import useColorScheme from '../../hooks/useColorScheme'
import SlideModal from '../../components/SlideModal'
import StyledTextInput from '../../components/StyledTextInput'
import { connect, useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../services/user'
import { getDefaultImage, getErrorMessage, getResultsFromSearch } from '../../utils'
import { addUserToChat, createChat, removeUserFromChat, updateChat } from '../../services/chats'
import { RegularText } from '../../components/StyledText'
import CustomImage from '../../components/CustomImage'
const SchoolSettings = (props) => {
    const { useCase } = props.route.params;
    const [school, setSchool] = useState(props.route.params.school);
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const currentUser = useSelector(state => state.userState.currentUser);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const chats = useSelector(state => state.chatsState.chats);
    const schools = chats.filter(item => item.type == 'school');
    const dispatch = useDispatch();
    const onSavePress = () => {

        if (props.route.params.school != null) {
            setShowConfirmationModal(true);
        }
        else {
            handleUpdateSchools();
        }
    }
    const addUserToSchool = (keepData) => {
        addUserToChat(school.id)
            .then(() => {
                updateUser({
                    schoolId: school.id,
                    friends: keepData ? currentUser.friends : [],
                    studyBuddies: keepData ? currentUser.studyBuddies : []

                })
                    .then(() => {
                        dispatch({ type: 'CHANGE_SCHOOL', keepData });
                    })
                    .then(() => {

                        setLoading(false);
                        props.onTaskComplete('Saved!')
                        props.navigation.goBack();
                    })
                    .catch((e) => {
                        setLoading(false);
                        props.onTaskError(e);
                    })
            })
            .catch((e) => {
                setLoading(false);
                props.onTaskError(e);
            })
    }

    const createSchool = () => new Promise((resolve, reject) => {
        createChat({ ...school, users: [auth.currentUser.uid], isPublic: true })
            .then((id) => {

                //add the school id to the chat
                updateChat(id, { schoolId: id })


                    .catch((e) => {
                        setLoading(false);
                        props.onTaskError(e.message);
                    })
                    .then(() => resolve(id))




            })
            .catch((e) => {
                setLoading(false);
                props.onTaskError(e.message);
            })

    })


    const handleUpdateSchools = (keepData = false) => {
        props.onTaskStart('Saving...')
        setLoading(true);

        setShowConfirmationModal(false);




        //remove the current user from the previous school
        removeUserFromChat(props.route.params.school?.id)
            .catch((e) => {
                setLoading(false);

                props.onTaskError(e.message);
            })
            .then(() => {
                //if the school has an id (meaning it exists in the database)
                if (school?.id) {
                    //add the user to the school
                    addUserToSchool(keepData);

                }
                //if there is no id for the school (meaing it does not exisit in the database)
                else {

                    //add the school to the database
                    createSchool()
                        .then((id) => {

                            updateUser({

                                schoolId: id,
                                friends: keepData ? currentUser.friends : [],
                                studyBuddies: keepData ? currentUser.studyBuddies : []
                            })
                                .then(() => {
                                    setLoading(false);
                                    props.onTaskComplete('Saved!')
                                    props.navigation.goBack();
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    props.onTaskError(e.message);
                                })
                        })
                }
            })
    }

    const onSelectSchoolPress = () => {
        props.navigation.navigate('SelectChats', {
            onSubmit: (selected) => setSchool(selected[0]),
            placeholder: 'Type to find or create a school',
            title: 'Add School',
            selectionLimit: 1,
            type: 'school',
            canCreateNewItem: true,
            data: schools,
            useCase: "add school"

        });
    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>


            <Header
                title='School'

            />

            <SlideModal toValue={0.5} showModal={showConfirmationModal} onCancel={() => setShowConfirmationModal(false)}>

                <ConfirmationModal
                    confirmText={"Leave"}
                    slides={[{
                        title: "",
                        message: "Leave " + props.route.params.school?.name + "? You won't be able to see your chats made within this school anymore.",
                        confirmText: "Leave",
                        onCancelPress: () => setShowConfirmationModal(false)


                    },
                    {
                        title: "",
                        message: "Do you want to keep your friends and study buddies made in " + props.route.params.school?.name + "?",
                        confirmText: "Delete All",
                        cancelText: "Keep All",
                        onConfirmPress: handleUpdateSchools,
                        onCancelPress: () => handleUpdateSchools(true)

                    }

                    ]}

                />

            </SlideModal>


            <View style={styles.mainContainer}>

                <RegularText style={[styles.description, { color: Colors[colorScheme].darkGray, marginBottom: 30 }]}>{descriptions.school}</RegularText>




                <StyledTextInput
                    isClearable={false}
                    onPress={onSelectSchoolPress}
                    editable={false}
                    value={school?.name}
                    placeholder={"School"}
                    rightIcon={<CustomImage source={assets.down_arrow} style={{ width: 28, height: 28, tintColor: Colors[colorScheme].darkGray }} />}
                />




            </View>

            {useCase == 'settings' &&

                <Button
                    title='Save'
                    //disabled if no school is entered or the school id is the same as the id of the school we are already in
                    disabled={!school || (props.route.params.school?.id && school?.id == props.route.params.school?.id)}
                    onPress={onSavePress}
                    loading={loading}
                    colors={[Colors.primary, Colors.primary]}
                    style={{ width: '100%', height: 80, borderRadius: 0, position: 'absolute', bottom: 0, marginTop: 30 }}

                />
            }

        </View>
    )
}

export default SchoolSettings