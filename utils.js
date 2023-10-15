import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library'
import { auth, db } from "./Firebase/firebase";
import * as Haptics from 'expo-haptics'
import { EMAIL_ALREADY_IN_USE, INVALID_EMAIL, INVALID_PASSWORD, NETWORK_REQUEST_FAILED, SOMETHING_WENT_WRONG, TOO_MANY_REQUESTS, UNSUPPORTED_FILE_TYPE, USER_NOT_FOUND, WEAK_PASSWORD } from "./constants/ErrorMessages";
import { assets } from "./constants";
import { addFriend, sendFriendRequest } from "./services/friends";
import { addNotification } from "./services/notifications";

export async function pickImage() {
    let result = ImagePicker.launchCameraAsync();
    return result;
}

export async function askForCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status;
}
export function isValidPassword(password) {
    return password && password.length >= 6;
}
export async function openMediaLibrary(setMedia, mediaTypes = ImagePicker.MediaTypeOptions.Images, selectionLimit = 1) {

    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (galleryStatus.status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            selectionLimit,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result != null) {
            console.log(result.assets[0].uri);
            setMedia(result.assets[0].uri)
        }
    }
    return null


}
export function getResultsFromSearch(data, input) {
    let results = data;
    const filter = input?.trim()?.toUpperCase();




    if (filter && data) {
        results = data.filter(item => {
            const result = item?.name?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.displayName?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.title?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.divisionType?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.divisionNumber?.toString().indexOf(filter) > -1 ||
                item?.divisionType?.toUpperCase() + " " + item?.divisionNumber?.toString()?.indexOf(filter) > -1 ||
                item?.text?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.username?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.user?.displayName?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.user?.username?.toUpperCase()?.indexOf(filter) > -1 ||

                item?.subject?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.question?.toUpperCase()?.indexOf(filter) > -1 ||
                item?.tags?.join(' ')?.indexOf(filter) > -1;
            return result
        })


    }

    return results

}

export function search(data, search) {
    const filter = input.trim().toUpperCase()
    if (filter) {
        return data.filter(item => item.indexOf(filter) > -1)
    }

}


export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const uncapitalize = (str) => {
    if (!str) {
        return
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
}
export const getProfileItemsSubtitle = (items, itemName, emptyText) => {
    if (items.length == 0) {
        return emptyText || "No " + itemName + "s";
    }
    else if (items.length == 1) {
        return items.length + " " + itemName;
    }
    else {
        return items.length + " " + itemName + "s";
    }
}

export function getDeskCategory(contentType) {
    switch (contentType) {
        case "notes": return "Notes"
        case "flashcards": "Flashcards"
        case "poll": "Poll"
        case "burning question": "Burning Question"

    }
}

export function getDefaultImage(type) {
    switch (type) {
        case 'class': return assets.open_book.uri
        case 'school': return assets.grad_cap.uri
        case 'private': return assets.person_gradient.uri
        case 'group': return assets.group_chat.uri
        case 'lightning': return "https://i.ibb.co/Wgp64m5/lightning-bolt.png"
        case 'top': return assets.chart.uri
        case 'fire': return assets.fire.uri


    }
}

export function getZodiacSign(day, month, isEmoji) {

    let sign = "null";
    month = month + 1;
    if (month == 12) {

        if (day < 22)
            sign = !isEmoji ? "Sagittarius" : '♐️';
        else
            sign = !isEmoji ? "Capricorn" : '♑️';
    }

    else if (month == 1) {
        if (day < 20)
            sign = !isEmoji ? "Capricorn" : '♑️';
        else
            sign = !isEmoji ? "Aquarius" : '♒️';
    }

    else if (month == 2) {
        if (day < 19)
            sign = !isEmoji ? "Aquarius" : '♒️';
        else
            sign = !isEmoji ? "Pisces" : '♓️';
    }

    else if (month == 3) {
        if (day < 21)
            sign = !isEmoji ? "Pisces" : '♓️';
        else
            sign = !isEmoji ? "Aries" : '♈️';
    }
    else if (month == 4) {
        if (day < 20)
            sign = !isEmoji ? "Aries" : '♈️';
        else
            sign = !isEmoji ? "Taurus" : '♉️';
    }

    else if (month == 5) {
        if (day < 21)
            sign = !isEmoji ? "Taurus" : '♉️';
        else
            sign = !isEmoji ? "Gemini" : '♊️';
    }

    else if (month == 6) {
        if (day < 21)
            sign = !isEmoji ? "Gemini" : '♊️';
        else
            sign = !isEmoji ? "Cancer" : '♋️';
    }

    else if (month == 7) {
        if (day < 23)
            sign = !isEmoji ? "Cancer" : '♋️';
        else
            sign = !isEmoji ? "Leo" : '♌️';
    }

    else if (month == 8) {
        if (day < 23)
            sign = !isEmoji ? "Leo" : '♌️';
        else
            sign = !isEmoji ? "Virgo" : '♍️';
    }

    else if (month == 9) {
        if (day < 23)
            sign = !isEmoji ? "Virgo" : '♍️';
        else
            sign = !isEmoji ? "Libra" : '♎️';
    }

    else if (month == 10) {
        if (day < 23)
            sign = !isEmoji ? "Libra" : '♎️';
        else
            sign = !isEmoji ? "Scorpio" : '♏️';
    }

    else if (month == 11) {
        if (day < 22)
            sign = !isEmoji ? "Scorpio" : '♏️';
        else
            sign = !isEmoji ? "Sagittarius" : '♐️';
    }

    return sign


}





export function getItemLayout(data, index) {
    const productHeight = 100;
    return {
        length: productHeight,
        offset: productHeight * index,
        index,
    };
};


export function getDisplayNameOrYou(userData) {

    if (!userData?.uid) {
        return "Someone"
    }

    if (userData?.uid !== auth.currentUser.uid) {
        return userData?.displayName
    }
    else {
        return "You"
    }






}


export function getDateDifference(unitNum, date) {
    const now = new Date()

    // Calculating the time difference between two dates
    const diffInTime = now.getTime() - date.getTime();

    // Calculating the no. of days between two dates
    return Math.round(diffInTime / unitNum);


}



export function getDateString(date) {
    const numSeconds = getDateDifference(1000, date)
    const numMinutes = getDateDifference(1000 * 60, date)
    const numHours = getDateDifference(1000 * 60 * 60, date)
    const numDays = getDateDifference(1000 * 60 * 60 * 24, date)
    const numWeeks = getDateDifference(1000 * 60 * 60 * 24 * 7, date)
    const numMonths = getDateDifference(1000 * 60 * 60 * 7 * 4, date)
    const numYears = getDateDifference(1000 * 60 * 60 * 7 * 4 * 12, date)
    if (numSeconds < 60) {
        return numSeconds + "s"
    }

    else if (numMinutes < 60) {
        return numMinutes + "m"
    }

    else if (numHours < 24) {
        return numHours + "h"
    }

    else if (numDays < 7) {
        return numDays + "d"

    }

    else if (numWeeks < 4) {
        return numWeeks + "w"
    }


    else if (numMonths < 12) {
        return numMonths + "mo"
    }

    else {
        return numYears + "y"
    }
}


export function doubleTap(delay, lastTap, setLastTap, handleDoubleTap) {
    const now = Date.now();

    if (lastTap && (now - lastTap) < delay) {
        handleDoubleTap()
    } else {
        setLastTap(now);
    }
}
export function getNumberOfCookies(tier) {
    switch (tier) {

    }
}


export function isSelected(selectedData, item) {
    return selectedData.includes(item)
}

export const handleSearchByName = (collectionPath, search, setData) => {
    db.collection(collectionPath)
        .orderBy('name', 'asc')
        .startAt(search.toUpperCase())
        .endAt(search.toLowerCase + '\uf8ff')
        .get()
        .then(query => {
            let data = query.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return { id, ...data }
            })
            setData(data)
        })

}
export function isValidEmail(email) {

    return email.indexOf('.') <= (email.length - 1) - 2 &&
        email.indexOf('.') >= 0 &&
        email.indexOf('@') >= 1 &&
        email.substring(email.indexOf('@'), email.indexOf('.')).length > 1
}

export function getErrorMessage(message) {
    if (message.includes('(auth/invalid-email).')) {
        return INVALID_EMAIL
    }
    else if (message.includes('(auth/user-not-found).')) {
        return USER_NOT_FOUND
    }
    else if (message.includes('(auth/wrong-password).')) {
        return INVALID_PASSWORD
    }
    else if (message.includes('(auth/too-many-requests)')) {
        return TOO_MANY_REQUESTS
    }
    else if (message.includes('(auth/network-request-failed).') || message.includes("Backend didn't respond within 10 seconds")) {
        return NETWORK_REQUEST_FAILED
    }
    else if (message.includes('(auth/weak-password).')) {
        return WEAK_PASSWORD
    }
    else if (message.includes('(auth/email-already-in-use).')) {
        return EMAIL_ALREADY_IN_USE
    }
    else if (message == UNSUPPORTED_FILE_TYPE) {
        return UNSUPPORTED_FILE_TYPE;
    }
    else return SOMETHING_WENT_WRONG
}



export const getResultsFromFilter = (data, selectedFilter, otherData = []) => {
    if (selectedFilter == 'Schools') {
        return data.filter(item => item?.type == 'school');
    }
    else if (selectedFilter == 'Classes') {

        return data.filter(item => item?.type == 'class');
    }
    else if (selectedFilter == 'Groups & Clubs') {
        return data.filter(item => item?.type == 'group' || item?.type == 'club');
    }
    else if (selectedFilter == 'Study Buddies') {

        return data.filter(item => {
            const otherUser = item?.users?.find(uid => uid != auth.currentUser.uid);
            return (item?.type == 'private' && otherData.map(item => item?.uid).includes(otherUser)) || otherData.map(item => item?.uid).includes(item?.uid);
        });
    }

    else if (selectedFilter == 'Friends') {
        return data.filter(item => {
            const otherUser = item?.users?.find(uid => uid != auth.currentUser.uid);
            return (item?.type == 'private' && otherData.map(item => item?.uid).includes(otherUser)) || otherData.map(item => item?.uid).includes(item?.uid);
        });
    }
    else {
        return [];
    }
}


export const checkUniqueUsername = (value) => new Promise((resolve, reject) => {
    db.collection('users')
        .where('username', '==', value.toLowerCase())
        .get()
        .then(query => {
            if (query.docs.length > 0) {
                console.log("not unique")
                reject("The username " + value + " is not available");

            } else {
                console.log("is unique")

                resolve();


            }

        })
        .catch(reject)


})


export const isValidImage = (imageUrl, callback) => {
    const isValidImageUrl = (/\.(gif|jpe?g|jpg|tiff?|png|webp|bmp)$/i).test(imageUrl);
    if (isValidImageUrl) {
        fetch(imageUrl)
            .then(response => {
                if (response.ok) {
                    callback && callback(true);
                }

            })
            .catch((e) => {
                console.log(e);
                callback && callback(false);

            })

    }
    else
        callback && callback(false);
}


export function checkValidUsername(value, setError) {
    var letters = /^[A-Za-z0-9_.]+$/;
    if (value.startsWith('.')) {
        setError("You can't start your username with a period.")
        return false
    }
    if (value.endsWith('.')) {
        setError("You can't end your username with a period.")
        return false
    }
    if (value.length < 3) {
        setError('Your username must be at least 3 characters long.')
        return false
    }

    if (!value.match(letters)?.length) {
        setError("Usernames can only use Roman letters (a-z, A-Z), numbers, underscores and periods")
        return false

    }

    setError('')
    return true
}
export function onSelect(selectedData, setSelectedData, item, selectionLimit) {

    if (selectedData.includes(item)) //if we select an item that is already selected
    {
        const deselect = selectedData.filter(selected => selected != item) // create a new data array that does not include the selected item
        return setSelectedData(deselect)
    }

    if (selectedData.length === selectionLimit && selectionLimit != 1) {
        return
    }

    if (selectedData.length === selectionLimit && selectionLimit == 1) {
        return setSelectedData([item]); // add item to selected items array

    }

    setSelectedData([...selectedData, item]); // add item to selected items array

}


export function haptics(feedbackStyle = 'light') {
    if (feedbackStyle === 'light')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    else if (feedbackStyle === 'medium')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    else if (feedbackStyle === 'heavy')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)


}





export function getName(firstName, lastName) {
    let name = ""
    if (!firstName) {
        name = lastName
    }
    else if (!lastName) {
        name = firstName
    }
    if (name)
        return name
    return "Someone"

}

