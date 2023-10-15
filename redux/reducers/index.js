import { combineReducers } from "redux";
import { user } from './user'
import { school } from './school'
import { users } from "./users";
import { classState } from "./class";
import { classes } from "./classes";
import { ranks } from "./ranks";
import { feed } from "./feed";
import { screens } from "./screens";
import { desks } from "./desks";
import { chats, userChats } from "./chats";
import { messages } from "./messages";
import { userDesk } from "./userDesk";
import { notifications } from "./notifications";

const Reducers = combineReducers({
    userState: user,
    schoolState: school,
    usersState: users,
    classState: classState,
    classesState: classes,
    ranksState: ranks,
    feedState: feed,
    screensState: screens,
    desksState: desks,
    userChatsState: userChats,
    chatsState: chats,
    messagesState: messages,
    userDeskState: userDesk,
    desksState: desks,
    notificationsState: notifications
})

export default Reducers
