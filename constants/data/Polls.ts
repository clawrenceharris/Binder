import Users from "./Users";

export default [

    {
        id: '0',
        title: 'How much did you study for the test?',
        user: Users[1],
        options: [


            {
                option: 'read the whole book',
                votes: [Users[2]]
            },

            {
                option: 'Not enough',
                votes: [Users[3], Users[4], Users[0]]
            },
            {
                option: 'forgot the test was today',
                votes: [Users[1], Users[4]]
            },
        ],



        timestamp: new Date(),
        totalVotes: 5

    },
]