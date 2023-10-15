// @refresh reset
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useColorScheme from './hooks/useColorScheme';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
import { auth } from './Firebase/firebase';
import { NavigationContainer } from '@react-navigation/native';
import Main from './screens/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './screens/Settings/Settings';
import {
  BirthdaySettings,

  EmailSettings,
  GPASetttings,
  GraduationYearSettings,
  NameSettings,
  PasswordSettings,
  Profile,
  SchoolSettings,
  SignUpBirthday,
  SignUpName,
  SignUpSchool,
  CameraScreen,
  Chat,
} from './screens';
import AchievementsScreen from './screens/Achievements';
import DeskItem from './screens/DeskItem';
import SelectDeskItem from './screens/SelectDeskItem';
import Feed from './screens/Feed';
import StartScreen from './screens/StartScreen';
import Login from './screens/Login';
import Desk from './screens/Desk';
import { assets, Colors } from './constants';
import Search from './screens/Search';
import SignUpEmail from './screens/SignUp/SignUpEmail';
import SignUpUsername from './screens/SignUp/SignUpUsername';
import NewBurningQuestion from './screens/NewBurningQuestion';
import BurningQuestion from './screens/BurningQuestion';
import NewBurningQuestionB from './screens/NewBurningQuestionB';
import NewPost from './screens/NewPost';
import EditMediaToSend from './screens/Camera/EditMediaToSend';
import { ActivityIndicator } from 'react-native-paper';
import DeskItemPicker from './screens/DeskItemPicker';
import ChatProfile from './screens/ChatProfile';
import Share from './screens/Share';
import Notifications from './screens/Notifications';
import UsernameSettings from './screens/Settings/UsernameSettings';
import Discover from './screens/Discover';
import Items from './screens/Items';
import FullScreenMedia from './screens/FullScreenMedia';
import SelectUsers from './screens/SelectUsers';
import SelectChats from './screens/SelectChats';
import SignUpPhoto from './screens/SignUp/SignUpPhoto';
import EditChat from './screens/EditChat';
import EditChatImage from './screens/EditChatImage';
import Notification from './components/Notification';
import { RegularText } from './components/StyledText';
import { getErrorMessage } from './utils';
import SendReport from './screens/SendReport';
import Bug from './screens/Bug';
import ResetPassword from './screens/ResetPassword';
import Game from './screens/Game';
import Explore from './screens/Explore';
import EditDeskItemB from './screens/EditDeskItemB';
import EditGame from './screens/EditGame';
import EditDeskItemA from './screens/EditDeskItemA';





const store = createStore(rootReducer, applyMiddleware(thunk))
export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const colorScheme = useColorScheme();
  const Stack = createNativeStackNavigator();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showLoadingNotification, setShowLoadingNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notification, setNotification] = useState('');
  const [loadingNotification, setLoadingNotification] = useState('')
  const [errorNotification, setErrorNotification] = useState('')

  const translateValue = useRef(new Animated.Value(0)).current;
  const { height } = Dimensions.get('window');


  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
        setIsLoggedIn(true);


      }
      else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    })


  }, [])


  const onTaskStart = (message) => {
    setLoadingNotification(message);

    setShowErrorNotification(false);
    setShowLoadingNotification(true);

  }
  const onTaskComplete = (message) => {
    setNotification(message);

    setShowErrorNotification(false);
    setShowLoadingNotification(false);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false)
    }, 2500);
  }

  const onTaskError = (message) => {

    setErrorNotification(getErrorMessage(message));

    setShowLoadingNotification(false);
    setShowErrorNotification(true);

    console.log(message);

    setTimeout(() => {
      setShowErrorNotification(false);
    }, 3000);
  }






  if (loading) {

    return (
      <ImageBackground source={assets.splash} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ marginTop: 60 }} color={Colors.accent} size="large" />
      </ImageBackground>
    )

  }


  if (!isLoggedIn) {
    return (

      <SafeAreaProvider >
        <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
        <Notification show={showNotification}>
          <RegularText white h5 style={{ textAlign: 'center' }}>{notification}</RegularText>

        </Notification>
        <Notification show={showLoadingNotification}>
          <RegularText white h5 style={{ textAlign: 'center' }}>{loadingNotification}</RegularText>

        </Notification>
        <Notification show={showErrorNotification} error={true}>
          <RegularText white h5 style={{ textAlign: 'center' }}>{errorNotification}</RegularText>

        </Notification>
        <Provider store={store}>

          <NavigationContainer>
            <Stack.Navigator
              initialRouteName='StartScreen'
              screenOptions={{
                headerShown: false,
                animationDuration: 200,


              }} >

              <Stack.Group

                screenOptions={{ headerShown: false }}>

                <Stack.Screen
                  name="StartScreen"
                  component={StartScreen} />

                <Stack.Screen
                  name="SignUpName"
                  component={SignUpName}
                />

                <Stack.Screen
                  name="SignUpUsername"
                  component={SignUpUsername}
                />

                <Stack.Screen
                  name="SignUpBirthday"
                  component={SignUpBirthday} />

                <Stack.Screen
                  name="SignUpSchool"
                  component={SignUpSchool} />

                <Stack.Screen
                  name="SignUpPhoto"
                  children={(props) => <SignUpPhoto
                    onTaskStart={onTaskStart}
                    onTaskComplete={onTaskComplete}
                    onTaskError={onTaskError}
                    {...props} />}

                />

                <Stack.Screen name="EditMediaToSend" component={EditMediaToSend}
                  options={{
                    animation: 'none',
                    gestureEnabled: false,
                    animationEnabled: false,


                  }}
                />
                <Stack.Screen name="Camera" component={CameraScreen} />

                <Stack.Screen name="PasswordSettings"
                  children={(props) => <PasswordSettings
                    onTaskStart={onTaskStart}
                    onTaskComplete={onTaskComplete}
                    onTaskError={onTaskError}
                    {...props} />}
                />

                <Stack.Screen name="ResetPassword"
                  component={ResetPassword}
                />

                <Stack.Screen
                  name="SignUpEmail"
                  component={SignUpEmail}

                />

                <Stack.Screen
                  name="Login"
                  component={Login}

                />
                <Stack.Screen name="SelectChats" component={SelectChats}
                  options={{
                    gestureDirection: 'vertical'

                  }} />

              </Stack.Group >
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>

      </SafeAreaProvider >

    )
  }



  return (

    <SafeAreaProvider >
      <Notification show={showNotification}>
        <RegularText white h5 style={{ textAlign: 'center' }}>{notification}</RegularText>

      </Notification>
      <Notification show={showLoadingNotification}>
        <RegularText white h5 style={{ textAlign: 'center' }}>{loadingNotification}</RegularText>

      </Notification>
      <Notification show={showErrorNotification} error={true}>
        <RegularText white h5 style={{ textAlign: 'center' }}>{errorNotification}</RegularText>

      </Notification>
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />

      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='Main'
            screenOptions={{
              headerShown: false,


            }}

          >


            <Stack.Screen
              name={"Main"}
              children={(props) => <Main
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props}
              />}

              options={{ headerShown: false }} />



            <Stack.Screen name="ResetPassword"
              component={ResetPassword}
            />

            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen
              name="Notifications"

              children={(props) => <Notifications
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
              options={{

                gestureDirection: 'vertical',

              }}
            />
            <Stack.Screen
              name="Bug"

              children={(props) => <Bug
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}

            />
            <Stack.Screen
              name="Game"

              children={(props) => <Game
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}

            />

            <Stack.Screen
              name="Explore"
              options={{
                gestureDirection: 'vertical'
              }}
              children={(props) => <Explore
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}

            />
            <Stack.Screen
              name="EditGame"

              children={(props) => <EditGame
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}

            />
            <Stack.Screen
              name="NameSettings"
              children={(props) => <NameSettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
            />
            <Stack.Screen
              name="SendReport"
              children={(props) => <SendReport
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
            />
            <Stack.Screen
              name="UsernameSettings"
              children={(props) => <UsernameSettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />} />

            <Stack.Screen name="EmailSettings"
              children={(props) => <EmailSettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
            />
            <Stack.Screen name="BirthdaySettings"
              children={(props) => <BirthdaySettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />} />
            <Stack.Screen name="GPASettings"
              children={(props) => <GPASetttings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />} />
            <Stack.Screen name="SchoolSettings"
              children={(props) => <SchoolSettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
            />
            <Stack.Screen name="GraduationYearSettings"
              children={(props) => <GraduationYearSettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />} />

            <Stack.Screen name="PasswordSettings"
              children={(props) => <PasswordSettings
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
            />
            <Stack.Screen name="Share" children={(props) =>
              <Share
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />}
              options={{ gestureDirection: 'vertical' }}

            />



            <Stack.Screen name="EditMediaToSend" component={EditMediaToSend}
              options={{
                gestureEnabled: false,
                animationEnabled: false,
                animation: 'none',
                animationDuration: 10

              }}
            />
            <Stack.Screen name="Camera" component={CameraScreen}
              gestureDirection="vertical"
            />





            <Stack.Screen name="Profile" children={(props) =>
              <Profile
                onTaskComplete={onTaskComplete}
                onTaskStart={onTaskStart}
                onTaskError={onTaskError}
                {...props}
              />}
            />
            <Stack.Screen name="ChatProfile" children={(props) => <ChatProfile
              {...props}
              onSendStart={onTaskStart}
              onSendComplete={onTaskComplete}
              onSendError={onTaskError}
            />}
            />
            <Stack.Screen name="Discover" component={Discover} />

            <Stack.Screen name="NewPost" component={NewPost}

              options={{

                gestureDirection: 'vertical'
              }}
            />


            <Stack.Screen
              name="Items"
              children={(props) => <Items
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props}
              />}
            />


            <Stack.Screen name="BurningQuestion"
              children={(props) => <BurningQuestion
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />} />
            <Stack.Screen name="NewBurningQuestion" component={NewBurningQuestion} />
            <Stack.Screen
              name="NewBurningQuestionB"
              children={(props) => <NewBurningQuestionB
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
                {...props} />} />



            <Stack.Screen name="SelectUsers" component={SelectUsers}
              options={{
                gestureDirection: 'vertical'

              }}
            />
            <Stack.Screen name="SelectChats" component={SelectChats}
              options={{
                gestureDirection: 'vertical'

              }} />



            <Stack.Screen name="EditChat" component={EditChat} />

            <Stack.Screen name="EditChatImage" component={EditChatImage} />

            <Stack.Screen name="Feed" component={Feed} />

            <Stack.Screen name="FullScreenMedia" component={FullScreenMedia}
              options={{
                gestureDirection: 'vertical'
              }}
            />

            <Stack.Screen name="Achievements" component={AchievementsScreen}
              options={{
                gestureDirection: "vertical",
                headerShown: false,
                presentation: 'modal',


              }} />




            <Stack.Screen
              name="Search"

              children={(props) =>
                <Search
                  onTaskStart={onTaskStart}
                  onTaskComplete={onTaskComplete}
                  onTaskError={onTaskError}
                  {...props}
                />}
              options={{
                gestureDirection: 'vertical',
                animation: 'fade_from_bottom',
                animationDuration: 150

              }} />



            <Stack.Screen
              name="Chat"
              children={(props) =>
                <Chat
                  onTaskStart={onTaskStart}
                  onTaskComplete={onTaskComplete}
                  onTaskError={onTaskError}
                  {...props}
                />}
              options={{
                headerShown: false

              }} />


            <Stack.Screen name="DeskItemPicker" component={DeskItemPicker}
              options={{
                headerShown: false,
                presentation: 'modal',


              }} />

            <Stack.Screen
              name="EditDeskItemB"
              children={(props) =>
                <EditDeskItemB
                  onTaskStart={onTaskStart}
                  onTaskComplete={onTaskComplete}
                  onTaskError={onTaskError}
                  {...props}
                />}
              options={{ headerShown: false }} />

            <Stack.Screen
              name="EditDeskItemA"
              component={EditDeskItemA}
              options={{ headerShown: false }} />


            <Stack.Screen name="Desk"
              options={{
                gestureDirection: 'vertical',
                headerShown: false,

              }}
              children={(props) => <Desk {...props}
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
              />}
            />
            <Stack.Screen name="DeskItem"

              children={(props) => <DeskItem {...props}
                onTaskStart={onTaskStart}
                onTaskComplete={onTaskComplete}
                onTaskError={onTaskError}
              />}
              options={{
                gestureDirection: 'vertical',
                headerShown: false,

              }}


            />

            <Stack.Screen name="SelectDeskItem" component={SelectDeskItem}
              options={{
                gestureDirection: "vertical",
                presentation: 'modal'

              }}

            />



          </Stack.Navigator>


        </NavigationContainer>

      </Provider>
    </SafeAreaProvider>
  );




}






