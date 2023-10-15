import { Colors } from "../../constants";
import { StyleSheet } from "react-native";

const descriptions = {
    password: "Enter a password you'll use.",
    email: 'This will be used to log back into your account.',
    gpa: 'Your GPA is your grade point average. We use you unweighted GPA to help pair you with recommended study partners. You can choose to leave this field blank',
    name: "This is how you'll appear and how classmates can find you on Binder.",
    birthday: "We'll use this to determine your age and Zodiac Sign.",
    school: "This lets us show you your school communities, and recommend study buddies.",
    username: "Pick a username for classmates to find you by.\nYou can change this later.",
    photo: "Personalize your profile even further by adding a pic!"
}

const styles = StyleSheet.create({



    textInputTitle: {
        color: '#00000050',
        alignSelf: 'flex-start',
        fontSize: 12
    },

    finePrint: {
        fontFamily: 'Kanit',
        color: 'darkgray',
        fontSize: 14,
        textAlign: 'center',
    },

    errorMessage: {
        color: '#FD6464',
        alignSelf: 'flex-start'
    },

    screenTitle: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
        width: '90%',
        textAlign: 'center'
    },

    birthdayInputContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    input: {
        width: '100%',
        fontSize: 20,
        padding: 10,
        fontFamily: 'Kanit',
        color: 'white',
        backgroundColor: '#00000010',
        borderRadius: 25
    },

    description: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        marginTop: 10
    },

})

export { styles, descriptions }
