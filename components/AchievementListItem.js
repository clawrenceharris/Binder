import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import React, { useState } from 'react'
import { assets, Colors } from '../constants'
import Button from './Button'

const CIRCLE_LENGTH = 250
const STROKE_WIDTH = 3
const RADIUS = CIRCLE_LENGTH / (2 * Math.PI)

const AchievementListItem = (props) => {
    const [showModal, setShowModal] = useState(false)
    const { name, icon, amountDone, levelGoals, description, index } = props.item

    const getProgress = () => {
        return 0
    }

    const getAmountDoneProgress = (item, index) => {
        return amountDone / item
    }


    const isComplete = () => {
        return getProgress() === 1
    }

    const isSomeComplete = () => {
        return false
    }
    return (
        <View>

            {/* <ModalComponent animated showModal={showModal} toValue={-900} width={300} height={370}
                renderContent={(
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                        <Image source={assets.send} style={{ width: 28, height: 28, tintColor: '#00000070', position: 'absolute', top: 10, right: 10 }} />

                        <Text style={{ color: '#00000070', fontFamily: 'Kanit', fontSize: 16, position: 'absolute', left: 10, top: 10 }}>{"Hint"}</Text>

                        <View style={{ backgroundColor: '#00000010', borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#00000020' }}>
                            {isSomeComplete() && <Text style={{ fontSize: 36 }}>{icon}</Text>}
                            {!isSomeComplete() && <Image source={assets.question_mark} style={{ width: 40, height: 40, tintColor: '#00000080' }} />}
                        </View>


                        <Text style={{ textAlign: 'center', fontFamily: 'KanitMedium', color: '#6F6F6F', fontSize: 16 }}>{name}</Text>
                        <Text style={{ textAlign: 'center', fontFamily: 'Kanit', color: '#6F6F6F', width: '100%' }}>{description + " (" + amountDone + "/" + levelGoals[index] + ")"}</Text>

                        <View style={{ paddingRight: 40, margin: 20 }}>
                            {levelGoals.map((done, index) =>


                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Image source={assets.star} style={{ width: 28, height: 28, tintColor: getAmountDoneProgress(done, index) >= 1 ? Colors.primary : '#00000030' }} />

                                    <View style={{ backgroundColor: 'gray', height: 20, width: `100%`, borderRadius: 50, marginLeft: 10 }}>


                                        {getAmountDoneProgress(done, index) * 100 > 0 && getAmountDoneProgress(done, index) * 100 < 100 &&

                                            <View style={{ minWidth: '15%', paddingHorizontal: 5, backgroundColor: Colors.primary, height: 20, width: `${getAmountDoneProgress(done, index) * 100}%`, borderRadius: 50 }}>
                                                <Text style={{ fontFamily: 'Kanit', color: 'white' }}>{`${getAmountDoneProgress(done, index) * 100}%`}</Text>

                                            </View>}

                                        {getAmountDoneProgress(done, index) * 100 >= 100 &&
                                            <View style={{ paddingHorizontal: 5, backgroundColor: Colors.primary, height: 20, width: `100%`, borderRadius: 50 }}>
                                                <Text style={{ fontFamily: 'Kanit', color: 'white' }}>{`Completed!`}</Text>

                                            </View>}

                                        {getAmountDoneProgress(done, index) * 100 == 0 &&
                                            <View style={{ paddingHorizontal: 5, backgroundColor: 'gray', borderRadius: 50 }}>
                                                <Text style={{ fontFamily: 'Kanit', color: 'white' }}>{`0%`}</Text>
                                            </View>}
                                    </View>

                                    <Text style={{ position: 'absolute', right: -20, fontFamily: 'Kanit', color: 'darkgray' }}>{amountDone + "/" + done}</Text>
                                </View>
                            )}

                        </View>

                        <Button

                            title='Done'
                            onPress={() => { setShowModal(false) }}
                        />

                    </View>


                )}


            /> */}



            {props.circle &&
                <TouchableWithoutFeedback onPress={() => { setShowModal(true) }}>

                    <View>

                        <View style={{ marginVertical: 40, marginHorizontal: 10, width: 90, height: 90, backgroundColor: '#474747', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>

                            {isSomeComplete() && <Text style={{ fontSize: 40 }}>{icon}</Text>}




                        </View>


                        <View style={{ marginTop: -60, flexDirection: 'row', justifyContent: 'center' }}>
                            {/* {amount.map((done, index) =>
                                getAmountDoneProgress(done, index) >= 1 ?


                                    <Image source={assets.star} style={{ width: 28, height: 28, tintColor: Colors.light.accent }} />

                                    : <></>)

                            } */}

                        </View>

                    </View>
                </TouchableWithoutFeedback>}



            {!props.circle &&
                <TouchableWithoutFeedback onPress={() => { setShowModal(true) }}>

                    <View>
                        <View style={{ margin: 10, padding: 8, backgroundColor: '#00000030', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ textAlign: 'center', fontFamily: 'KanitMedium', color: '#00000090', fontSize: 16 }}>{name + " (Level " + (index + 1) + ")"}</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                {/* <Svg width={120} height={110} >
                                    {getProgress() > 0 ?
                                        <Circle
                                            cx={58}
                                            cy={55}
                                            strokeWidth={STROKE_WIDTH}
                                            stroke={Colors.primary}
                                            r={RADIUS}
                                            strokeDashoffset={CIRCLE_LENGTH * (1 - (getProgress()))}
                                            strokeLinecap='round'
                                            strokeDasharray={CIRCLE_LENGTH}
                                        />
                                        :

                                        <Circle
                                            cx={58}
                                            cy={55}
                                            strokeWidth={STROKE_WIDTH}
                                            stroke={'#00000070'}
                                            r={RADIUS}
                                            strokeDashoffset={RADIUS}
                                            strokeLinecap='round'
                                            strokeDasharray={5}
                                        />
                                    }


                                </Svg> */}
                                <View style={{ flexDirection: 'row', margin: 10, width: 70, height: 70, backgroundColor: '#00000070', borderRadius: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 13 }}>

                                    {isSomeComplete() && <Text style={{ fontSize: 40, color: '#6F6F6F' }}>{icon}</Text>}
                                    {!isSomeComplete() && <Image source={assets.question_mark} style={{ width: 40, height: 40, tintColor: '#00000080' }} />}


                                </View>

                                <Text style={{ fontFamily: 'Kanit', color: '#00000070', width: '60%' }}>{description + " (" + amountDone + "/" + levelGoals[index] + ")"}</Text>
                            </View>

                        </View>

                    </View>
                </TouchableWithoutFeedback>

            }
        </View>



    )
}

export default AchievementListItem