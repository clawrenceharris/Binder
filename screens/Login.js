import { KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../Firebase/firebase';
import { getErrorMessage } from '../utils';
import { styles } from './SignUp';
import Header from '../components/Header';
import Button from '../components/Button';
import { Colors } from '../constants';
import useColorScheme from '../hooks/useColorScheme';
import StyledTextInput from '../components/StyledTextInput';
import { INVALID_USERNAME, USER_NOT_FOUND } from '../constants/ErrorMessages';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/auth';
import { BoldText, MediumText, RegularText } from '../components/StyledText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login = (props) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const onLogIn = () => {
    setLoading(true)

    //if the username has an @ symbol it is an email so try logging in with it
    if (emailOrUsername.includes('@')) {
      dispatch(login(emailOrUsername, password))
        .then(() => {
          setLoading(false);
        })
        .catch(e => {
          setError(getErrorMessage(e.message));
          console.error(e.message);
          setLoading(false);
        })
    }
    //otherwise it must be a username
    else {
      db.collection('users')
        .where('username', '==', emailOrUsername.toLowerCase())
        .get()
        .then(query => {
          if (query.docs.length === 1) {
            auth.signInWithEmailAndPassword(query.docs[0].data().email, password)
              .then(() => {
                setLoading(false);

              })
              .catch((e) => {

                setError(getErrorMessage(e.message));
                console.log(e.message);
                setLoading(false);
              })

          }
          else {
            setError(INVALID_USERNAME)
            setLoading(false)

          }


        })
        .catch((e) => {
          setError(getErrorMessage(e.message))
        })
    }

  }




  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>



        <Header color={Colors.accent} />
        <MediumText h2 style={{ alignSelf: 'center' }}>{"Log In"}</MediumText>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center', padding: 30 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"} >

          <StyledTextInput
            isClearable
            containerStyle={{ marginBottom: 30 }}
            placeholder="Email or username"
            secureTextEntry={false}
            keyboardType='email-address'
            value={emailOrUsername}
            autoFocus
            onChangeText={setEmailOrUsername}
          />

          <StyledTextInput
            isClearable
            containerStyle={{ marginBottom: 10 }}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            onSubmitEditing={() => {
              if (emailOrUsername && password)
                onLogIn()
            }}

          />







          <RegularText style={{ color: Colors.red }}>{error}</RegularText>
          <MediumText accent onPress={() => props.navigation.navigate('ResetPassword')} style={{ textAlign: 'right' }}>{"Forgot Password?"}</MediumText>

          <Button
            title={'Log In'}
            style={{ marginTop: 20, paddingHorizontal: 50 }}
            onPress={onLogIn}
            disabled={!emailOrUsername || !password}
            loading={loading}
          />
        </KeyboardAvoidingView>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: insets.bottom, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RegularText darkgray >{"Don't have an account? "}</RegularText>
            <MediumText

              accent
              onPress={() => props.navigation.navigate(' SignUp')}>
              {"Sign Up"}
            </MediumText>
          </View>









        </View>
      </View>

    </TouchableWithoutFeedback>

  )
}


export default Login