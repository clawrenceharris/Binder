
import { StyleSheet } from "react-native";
import { Colors } from "../../constants";





const styles = StyleSheet.create({

    mainContainer: {
        padding: 15,
        alignItems: 'center'
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
    },
    finePrint: {
        color: Colors.white,
        fontSize: 11,
        textAlign: 'center',
    },

    errorMessage: {
        color: '#FD6464',
    },
    successMessage: {
        color: '#77FF8C',
    },

    birthdayInputContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
        marginTop: 40,
        flexDirection: 'row'
    },
    input: {
        width: '100%',
        fontSize: 20,
        padding: 10,
        color: Colors.white,
        backgroundColor: '#00000070',
        borderRadius: 25


    },

})

const descriptions = {
    password: 'We recommend choosing a strong password that includes uppercase letters, numbers and symbols.',
    email: 'This makes it easier for you to recover your account and for people to find you.',
    gpa: 'Your GPA is your grade point average. We use your unweighted GPA to help pair you with recommended study buddies. You can choose to leave this blank or manage who can see it.',
    name: "This is how you'll appear and how your classmates can find you.",
    birthday: "We'll use this to determine your age and Zodiac Sign.",
    school: "This lets us show you your school communities, and recommend study buddies.",
    username: "This is how others can find you on Binder. Make it unique to you!",


}

export { styles, descriptions }