import { View, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { assets, Colors } from '../../constants'
import useColorScheme from '../../hooks/useColorScheme'
import { descriptions, styles } from '.'
import { db } from '../../Firebase/firebase'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { handleSearchByName } from '../../utils'
import StyledTextInput from '../../components/StyledTextInput'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChats } from '../../redux/actions/chats'
import { MediumText, RegularText } from '../../components/StyledText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomImage from '../../components/CustomImage'

const SignUpSchool = (props) => {
    const [school, setSchool] = useState(null);
    const [data, setData] = useState([]);
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    useEffect(() => {

        const unsubscribe = db.collection('chatrooms')
            .where('isPublic', '==', true)
            .onSnapshot(query => {
                const chats = query.docs.map(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    return { id, ...data };
                })
                setData(chats);
            });

        return () => {
            unsubscribe();
        }

    }, [])




    const onNextPressed = () => {

        props.navigation.navigate('SignUpPhoto', { ...props.route.params, school })
    }



    const onSelectSchoolPress = () => {
        props.navigation.navigate('SelectChats', {
            onSubmit: (selected) => setSchool(selected[0]),
            placeholder: 'Type to find or create a school',
            title: 'Add School',
            canCreateNewItem: true,
            type: 'school',
            selectionLimit: 1,
            data: data.filter(item => item.type == 'school'),
            useCase: 'add school'


        })
    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>

            <Header color={Colors.accent} />
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>


                <MediumText h3 style={{ marginBottom: 10 }}>{"What school do you go to"}</MediumText>
                <RegularText darkgray style={{ marginBottom: 30, textAlign: 'center' }}>{descriptions.school}</RegularText>


                <StyledTextInput
                    onPress={onSelectSchoolPress}
                    editable={false}
                    value={school?.name}
                    isClearable={false}
                    placeholder={"School"}
                    rightIcon={<CustomImage source={assets.down_arrow} style={{ width: 28, height: 28, tintColor: Colors[colorScheme].darkGray }} />}
                />
                <Button
                    title={'Next'}
                    onPress={onNextPressed}
                    style={{ marginVertical: 20, paddingHorizontal: 40, }}
                    disabled={!school}
                />

                <MediumText
                    h5
                    darkgray
                    onPress={onNextPressed}>Skip</MediumText>


            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: insets.bottom, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RegularText darkgray>{"Already have an account?"}{" "}</RegularText>

                    <MediumText

                        accent
                        onPress={() => props.navigation.navigate('LogIn')}>
                        {"Log in"}
                    </MediumText>
                </View>
            </View>
        </View >
    )
}

const mapDispatchProps = dispatch => bindActionCreators({ fetchChats }, dispatch)


export default connect(null, mapDispatchProps)(SignUpSchool)

