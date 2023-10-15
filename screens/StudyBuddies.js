import { View, Text } from 'react-native'
import React from 'react'
import { mainContainerStyle } from '../GlobalStyles'
import useColorScheme from '../hooks/useColorScheme'
import { Colors } from '../constants'
import { connect } from 'react-redux'

const StudyBuddies = (props) => {
    const colorScheme = useColorScheme()
    const { studyBuddies, school } = props
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={[{ ...mainContainerStyle, backgroundColor: colorScheme === 'light' ? '#F8F8F8' : Colors.dark.background }]}>

            </View>
        </View>
    )
}
const mapStateToProps = (store) => ({
    studyBuddies: store.userState.studyBuddies,
    school: store.schoolState.school

})
export default connect(mapStateToProps, null)(StudyBuddies)