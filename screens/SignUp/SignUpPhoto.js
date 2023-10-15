import {
    View,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { descriptions, styles } from '.'
import { assets, Colors } from '../../constants'
import { getDefaultImage, getErrorMessage, openMediaLibrary } from '../../utils'
import { auth, db } from '../../Firebase/firebase'
import Button from '../../components/Button'
import Header from '../../components/Header'
import useColorScheme from '../../hooks/useColorScheme'
import { ProfileButton } from '../../components'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchRanks } from '../../redux/actions'
import { createUser, updateUser } from '../../services/user'
import SlideModal from '../../components/SlideModal'
import OptionsList from '../../components/OptionsList'
import { faker } from '@faker-js/faker'
import firebase from 'firebase/compat'
import { register } from '../../redux/actions/auth'
import { BoldText, MediumText, RegularText } from '../../components/StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { addUserToChat, createChat, sendMessage } from '../../services/chats'
import CustomImage from '../../components/CustomImage'
const SignUpPhoto = (props) => {
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { displayName, birthday, school, email, password, username } = props.route.params;
    const colorScheme = useColorScheme();
    const { height } = Dimensions.get('window');
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const [binderUser, setBinderUser] = useState(null);
    useEffect(() => {
        db.collection('users')
            .doc("B5erZldDbNYVumd60QmIudlfqz93")
            .get()
            .then(doc => {
                setBinderUser(doc.data())
            })



    }, [])

    const sendBinderChat = () => new Promise((resolve, reject) => {
        createChat({
            users: [auth.currentUser.uid, binderUser.uid],
            name: binderUser.displayName,
            photoURL: binderUser.photoURL,
            type: "private",
            isPublic: false
        })
            .then(id => {
                sendMessage(id, "text", "Hey, " + displayName + "! Welcome to Binder, the app designed to make your school life simplier. Here are a few tips to get you started:" +
                    "\n\n\t1.) Discover People 🔍: Start finding people in your school in the Search screen. Once you add a student as a friend, you can do other actions like chat with them and add them as a Study Buddy!" +
                    "\n\n\t2.) Make Study Buddies 🤓: Study Buddies are denoted by the 🤓 emoji. Making Study Buddies helps you keep the people who you choose to study with separate from everyone else. Easily find them using the filter shortcuts below the search bar." +
                    "\n\n\t3.) Join Communities ✅: Start joining your classes, clubs and other communities in the Discover screen so you can connect with your classmates and other students. If you don't see what you're looking for, you can create a new community by tapping \"Create.\"" +
                    "\n\n\t4.) Build your Desk 📚: Just like in your typical classrooms, you'll see that you have your own Desk. This is where you can store all your study materials such as Notes and Flashcards. Stop by your Desk to start building it. Whatever you create, you can share it to students and communities by tapping on the Desk icon in the Chat screen. By default your Desk is private. Toggle the switch in the top right of the Desk screen to make it public and let other students see your all your scholarly creations!" +
                    "\n\n\t5.) Finish your Profile 👤: Finally, you should finish setting up your profile information in the Profile screen so people can connect with you. Tap on the pencil icons to start entering your info." +
                    "\n\nIf you have any questions, suggestions, or spot a bug, you can submit it through the Settings screen.\n\nHappy Binding!", null, null, null, false, binderUser.uid

                )
                    .then(resolve)
                    .catch(reject);

            })
            .catch(reject);
    })

    const addUserToSchool = (id) => new Promise((resolve, reject) => {
        addUserToChat(id)
            .then(resolve)
            .catch(reject)
    })


    const handleRegister = () => {
        props.onTaskStart('Loading...');
        setLoading(true);
        register(email, password)
            .then(() => {

                uploadPhoto()
                    .then((photoURL) => {
                        createUser(auth.currentUser.uid, username, displayName, photoURL, birthday, email, null)
                            .then(() => {
                                sendBinderChat()

                                if (!school) {
                                    setLoading(false);
                                    props.onTaskComplete('Account successfully created!');
                                    return;
                                }

                                if (school?.id)
                                    addUserToSchool(school.id)
                                        .then(() => {
                                            updateUser({ schoolId: school.id })
                                            setLoading(false);
                                            props.onTaskComplete('Account successfully created!');
                                        })
                                        .catch((e) => {
                                            setLoading(false);
                                            props.onTaskError(e.message);
                                        })
                                else {
                                    createChat({ ...school, isPublic: true, users: [auth.currentUser.uid] })
                                        .then((id) => {
                                            updateUser({ schoolId: id })

                                            setLoading(false);
                                            props.onTaskComplete('Success!');
                                        })
                                        .catch((e) => {
                                            setLoading(false);
                                            props.onTaskError(e.message);
                                        })
                                }
                            })
                            .catch(e => {
                                props.onTaskError(e.message);
                                setLoading(false);
                            });

                    })
                    .catch(e => {
                        props.onTaskError(e.message);
                        setLoading(false);

                    });
            })
            .catch(e => {
                props.onTaskError(e.message);
                setLoading(false);

            });

    }


    const onSkipPressed = () => {
        setImage(null);
        handleRegister();

    }

    const onTakePhotoPress = () => {
        setShowModal(false);
        setTimeout(() => {
            props.navigation.navigate('Camera', {
                callback: (image) => setImage(image),

                useCase: 'single photo to use'
            });
        }, 500);


    }

    const onLibraryPress = () => {

        openMediaLibrary(setImage)
            .then(() => {
                setShowModal(false)
            })

    }
    const uploadPhoto = () => new Promise(async (resolve, reject) => {
        if (image) {


            const response = await fetch(image);
            const blob = await response.blob();
            const uploadId = faker.datatype.uuid();

            //set the filename and path name
            const filename = image.substring(image.lastIndexOf('/') + 1);
            const path = `profile/${auth.currentUser.uid}/${uploadId}/${filename}`;

            firebase.storage()
                .ref()
                .child(path)
                .put(blob)
                .then((snapshot) => {
                    //get the completion percentage 
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log("file is", progress, '% uploaded')
                    snapshot.ref.getDownloadURL().then(url => {

                        resolve(url);

                    })
                        .catch(reject)
                })
                .catch(reject)

        }
        else {
            resolve(null)
        }
    })


    return (


        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

            <Header color={Colors.accent} />
            <SlideModal
                height={height - (3 * 50) - 20}
                showModal={showModal}
                onCancel={() => setShowModal(false)}>
                <OptionsList
                    onCancel={() => setShowModal(false)}
                    options={['Take Photo', 'Upload Photo']}
                    onOptionPress={[onTakePhotoPress, onLibraryPress]}
                />

            </SlideModal>
            <View style={{ paddingHorizontal: 15, alignItems: 'center' }}>
                <MediumText h3 style={{ marginBottom: 10 }}>{"You're almost done!"}</MediumText>
                <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.photo}</RegularText>

                <View >
                    <ProfileButton
                        imageURL={image}
                        defaultImage={getDefaultImage('private')}
                        size={150}
                        onPress={() => setShowModal(true)}

                    />


                    <TouchableWithoutFeedback onPress={() => setShowModal(true)}>

                        <View style={{ backgroundColor: Colors[colorScheme].background, borderRadius: 100, padding: 5, position: 'absolute', bottom: -5, right: -5 }}>
                            <View

                                style={{ width: 40, height: 40, borderRadius: 100, padding: 8, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', }}>
                                <CustomImage source={assets.add} style={{ width: 20, height: 20, tintColor: 'white' }} />

                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                </View>


            </View>



            <Button
                title={!image ? 'Finish' : 'Finish 😎'}
                onPress={handleRegister}
                style={{ margin: 20 }}
                disabled={!image || loading}
            />


            <MediumText
                h5
                darkgray
                style={{ textAlign: 'center' }}
                onPress={onSkipPressed}>{"Skip"}</MediumText>
            <View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: insets.bottom, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RegularText darkgray>{"Already have an account? "}</RegularText>
                    <MediumText

                        accent
                        onPress={() => props.navigation.navigate('LogIn')}>
                        {"Log in"}
                    </MediumText>
                </View>
            </View>

        </View>


    )
}
const mapStateToProps = store => ({
    ranks: store.ranksState.ranks
})
const mapDispatchProps = dispatch => bindActionCreators({ fetchRanks }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(SignUpPhoto)