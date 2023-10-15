import { faker } from "@faker-js/faker"
import { db } from "../../Firebase/firebase";
import Announcements from "./Announcements";
import ChatRooms from "./ChatRooms";

const getRandomLocation = () => {
    const streetAddress = faker.address.streetAddress();
    const state = faker.address.state();
    const zipCode = faker.address.zipCode();
    return streetAddress + " " +
        state + " " +
        zipCode
}

export default [



    {
        id: '0',
        name: 'Annapolis High School',
        type: 'high school',

        scheduleType: 'period based',
        logo: '',
        location: getRandomLocation(),
        users: null,
        active: null,
        classes: [
            db.collection('classes').doc('1'),
            db.collection('classes').doc('0'),
            db.collection('classes').doc('2'),
            db.collection('classes').doc('3'),
            db.collection('classes').doc('4'),
            db.collection('classes').doc('5'),
            db.collection('classes').doc('6'),
            db.collection('classes').doc('7'),
            db.collection('classes').doc('8'),
            db.collection('classes').doc('9')]




    }, {
        id: '1',
        name: 'Chesapeake Middle School',
        scheduleType: 'block based',
        type: 'middle school',
        logo: '',
        location: getRandomLocation(),
        users: null,
        active: null,
        classes: [
            db.collection('classes').doc('1'),
            db.collection('classes').doc('0'),
            db.collection('classes').doc('2'),
            db.collection('classes').doc('3'),
            db.collection('classes').doc('4'),
            db.collection('classes').doc('5'),
            db.collection('classes').doc('6'),
            db.collection('classes').doc('7'),
            db.collection('classes').doc('8'),
            db.collection('classes').doc('9')]

    }, {
        id: '2',
        name: 'Berry High School',
        scheduleType: 'period based',
        type: 'high school',
        logo: '',
        location: getRandomLocation(),
        users: null,
        active: null,

        classes: [db.collection('classes')]

    }, {
        id: '3',
        name: 'Towson University',
        scheduleType: 'time based',
        type: 'university',

        logo: '',
        location: getRandomLocation(),
        users: null,
        active: null,
        classes: [
            db.collection('classes').doc('1'),
            db.collection('classes').doc('0'),
            db.collection('classes').doc('2'),
            db.collection('classes').doc('3'),
            db.collection('classes').doc('4'),
            db.collection('classes').doc('5'),
            db.collection('classes').doc('6'),
            db.collection('classes').doc('7'),
            db.collection('classes').doc('8'),
            db.collection('classes').doc('9')]

    },
]