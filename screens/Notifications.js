import { View, Text, TouchableHighlight, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants'
import useColorScheme from '../hooks/useColorScheme'
import Header from '../components/Header'
import { bindActionCreators } from 'redux'
import { fetchNotifications } from '../redux/actions/notifications'
import { connect } from 'react-redux'
import NotificationListItem from '../components/NotificationListItem'
import { MediumText } from '../components/StyledText'
import { SHADOWS } from '../constants/Theme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Notifications = (props) => {
    const colorScheme = useColorScheme();
    const [refreshing, setRefreshing] = useState(false);
    const { notifications, loaded } = props;


    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(!loaded)
    }
    const ListEmptyComponent = () => {
        return (
            <View style={{ alignSelf: 'center', marginTop: 50 }}>
                <MediumText darkgray h5>{"No notifications yet"}</MediumText>

            </View>
        )
    }



    return (
        <GestureHandlerRootView style={{ flex: 1 }}>


            <View style={{ backgroundColor: Colors[colorScheme].background, flex: 1 }}>
                <Header
                    title="Notifications"
                    direction="vertical"
                />
                <FlatList
                    refreshControl={
                        <RefreshControl
                            tintColor={Colors[colorScheme].darkGray}
                            refreshing={refreshing}
                            title=''
                            onRefresh={onRefresh}
                        />
                    }
                    data={notifications}
                    ListEmptyComponent={ListEmptyComponent}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <NotificationListItem
                            item={item}
                            onTaskError={props.onTaskError}
                        />}

                />

            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    rowFront: {
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 60,
        margin: 5,
        marginBottom: 15,


    },

    rowFrontVisible: {
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 60,
        padding: 10,
        marginBottom: 15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'lightblue',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 5

    },

    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        paddingRight: 17
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    backRightBtnLeft: {
        backgroundColor: 'green',
        right: 75
    },
})
const mapStateToProps = (store) => ({
    notifications: store.notificationsState.notifications,
    loaded: store.notificationsState.loaded

})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchNotifications }, dispatch)
export default connect(mapStateToProps, mapDispatchProps)(Notifications)