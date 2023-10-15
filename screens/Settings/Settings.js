import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableWithoutFeedback, SectionList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../../Firebase/firebase'
import moment from 'moment'
import Header from '../../components/Header'
import Button from '../../components/Button'
import { assets, Colors } from '../../constants'
import { SHADOWS } from '../../constants/Theme'
import useColorScheme from '../../hooks/useColorScheme'
import { connect, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserSchool } from '../../redux/actions'
import { StatusBar } from 'expo-status-bar'
import { ConfirmationModal } from '../../components/Modals'
import SlideModal from '../../components/SlideModal'
import { MediumText, RegularText } from '../../components/StyledText'
import { deleteUser } from '../../services/user'
import CustomImage from '../../components/CustomImage'

const Settings = (props) => {
    const colorScheme = useColorScheme()
    const [showLogOutConfirmationModal, setShowLogOutConfirmationModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const dispatch = useDispatch();
    const { school } = props;
    const currentUser = useSelector(state => state.userState.currentUser);
    const [loading, setLoading] = useState(false)
    const accountData = [
        {
            title: 'Name',
            value: currentUser.displayName,
            onPress: () => props.navigation.navigate('NameSettings', { displayName: currentUser.displayName, useCase: 'settings' })
        },

        {
            title: 'Username',
            value: currentUser.username,
            onPress: () => props.navigation.navigate('UsernameSettings', { username: currentUser.username, useCase: 'settings' })
        },

        {
            title: 'Birthday',
            value: currentUser.birthday ? moment(new Date(currentUser.birthday)).format('MMM DD, YYYY') : '',
            onPress: () => props.navigation.navigate('BirthdaySettings', { birthday: currentUser.birthday })
        },

        {
            title: 'Email',
            value: currentUser.email,
            onPress: () => props.navigation.navigate('EmailSettings', { email: currentUser.email })
        },

        {
            title: 'Password',

            onPress: () => props.navigation.navigate('PasswordSettings', { useCase: 'change password' })
        }



    ]

    const schoolData = [
        {
            title: 'School',
            value: school?.name,
            onPress: () => props.navigation.navigate('SchoolSettings', { school, useCase: 'settings' })
        },

        {
            title: 'Graduation Year',
            value: currentUser.gradYear,
            onPress: () => props.navigation.navigate('GraduationYearSettings', { gradYear: currentUser.gradYear })
        },

        {
            title: 'GPA',
            value: currentUser.gpa,
            onPress: () => props.navigation.navigate('GPASettings', { gpa: currentUser.gpa })
        }
    ]

    const deskData = [
        {
            title: 'Desk Privacy',
            value: 'Public',
            onPress: () => props.navigation.navigate('DeskPrivacy', { privacy: 'Public' })
        },

    ]
    const actionsData = [
        {
            title: 'Log Out',

            onPress: () => setShowLogOutConfirmationModal(true)
        },
        {
            title: 'Delete Account',
            color: Colors.red,
            onPress: () => setShowDeleteConfirmationModal(true)
        },

    ];
    const supportAndFeedbackData = [
        {
            title: 'Get Help',
            onPress: () => props.navigation.navigate('SendReport', { title: 'Help', useCase: 'help' })


        },
        {
            title: 'Report a Bug',
            onPress: () => props.navigation.navigate('Bug')
        },
        {
            title: 'Send a Suggestion',
            onPress: () => props.navigation.navigate('SendReport', { title: 'Suggestion', useCase: 'suggestion' })
        },

    ];
    const sectionListData = [
        {
            title: 'Account',
            data: accountData
        },
        {
            title: 'School',
            data: schoolData
        },

        {
            title: 'Support & Feedback',
            data: supportAndFeedbackData
        },
        {
            title: 'Account Actions',
            data: actionsData
        }
    ]


    const logOut = () => new Promise((resolve, reject) => {
        setLoading(true);
        setShowLogOutConfirmationModal(false);

        // //sign user out of firebase
        setTimeout(() => {
            auth.signOut()
                .then(() => {

                    dispatch({ type: 'LOG_OUT' })
                    setLoading(false);
                    resolve();
                })
                .catch(e => {
                    props.onTaskError(e);
                    setLoading(false);
                    reject(e);
                })

        }, 1000);
    })





    const deleteAccount = () => {
        setLoading(true);
        setShowDeleteConfirmationModal(false);
        //log user out of firebase
        logOut()
            .then(() => {
                auth.currentUser.delete()
                    .then(() => {
                        deleteUser();
                        setLoading(false);
                    })

                    .catch((e) => {
                        props.onTaskError(e.message);
                        setLoading(false);
                    })

            })


    }





    const styles = StyleSheet.create({

        sectionContainer: {

            ...SHADOWS[colorScheme],
            shadowOffset: {
                width: 0, height: 10
            },
            shadowRadius: 10
        }
    })

    const SectionHeader = ({ title }) => {
        return (
            <View style={{ height: 40, paddingTop: 10, paddingHorizontal: 15, backgroundColor: Colors[colorScheme].background }}>
                <MediumText h5>{title}</MediumText>
            </View>
        )

    }

    const SectionItem = ({ item, index, isTop, isBottom }) => {
        return (
            <TouchableWithoutFeedback onPress={item.onPress}>


                <View style={{



                    shadowRadius: 10,
                    marginTop: isTop && 20,
                    marginBottom: isBottom && 20,
                    backgroundColor: Colors[colorScheme].invertedTint,
                    flexDirection: 'row',
                    padding: 20,
                    borderTopRightRadius: isTop && 15,
                    borderTopLeftRadius: isTop && 15,
                    borderBottomRightRadius: isBottom && 15,
                    borderBottomLeftRadius: isBottom && 15,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: Colors[colorScheme].lightGray,
                    borderBottomWidth: !props.isBottom ? 1 : 0,
                    marginHorizontal: 15,

                }}>
                    <RegularText h5 style={{ color: item?.color || Colors[colorScheme].tint }}>{item.title}</RegularText>
                    <View style={{ flexDirection: 'row' }}>
                        <MediumText darkgray>{item.value}</MediumText>
                        <CustomImage source={assets.right_arrow} style={{ width: 20, height: 20, tintColor: Colors[colorScheme].darkGray, marginLeft: 10 }} />
                    </View>
                </View>

            </TouchableWithoutFeedback>

        )

    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
            <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />

            <SlideModal toValue={0.5} showModal={showLogOutConfirmationModal}>
                <View style={{ backgroundColor: Colors[colorScheme].invertedTint, borderRadius: 15, width: '80%', alignSelf: 'center', height: 190 }}>


                    <ConfirmationModal

                        message='Log out of your account?'
                        onConfirmPress={() => {
                            logOut()
                        }}
                        confirmText={"Log out"}
                        onCancelPress={() => setShowLogOutConfirmationModal(false)}
                        loading={loading}

                    />
                </View>


            </SlideModal>

            <SlideModal toValue={0.5} showModal={showDeleteConfirmationModal}>


                <ConfirmationModal

                    message='Permanently delete your account?'
                    onConfirmPress={deleteAccount}
                    confirmText={"Delete"}
                    onCancelPress={() => setShowDeleteConfirmationModal(false)}
                    loading={loading}

                />


            </SlideModal>

            <Header
                navigation={props.navigation}
                direction={'horizontal'}
                title={'Settings'}

            />


            <SectionList
                sections={sectionListData}
                ListFooterComponent={<RegularText verydarkgray style={{ marginVertical: 30, textAlign: 'center' }}>{"Binder v1.0.0\n Made by Caleb Harris"}</RegularText>}
                renderSectionHeader={({ section }) => (
                    <SectionHeader title={section.title} />
                )}
                renderItem={({ item, index, section }) => (
                    <View style={styles.sectionContainer}>
                        <SectionItem item={item} index={index} isTop={index == 0} isBottom={index == section.data.length - 1} />
                    </View>
                )}
            />




        </View>
    )
}



const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    school: store.schoolState.school
})


export default connect(mapStateToProps, null)(Settings)