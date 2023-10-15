import { View, Dimensions, Animated, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { MediumText } from './StyledText'
import { FlatList } from 'react-native-gesture-handler'
import { SHADOWS, SIZES } from '../constants/Theme'
import { getItemLayout } from '../utils'

const CustomCarousel = ({ items, renderMedia, initialPage }) => {
    const { width, height } = Dimensions.get('window')
    const flatList = useRef(null)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const scrollX = useRef(new Animated.Value(0)).current;
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
    const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
    const handleScroll = (event) => {
        const { x } = event.nativeEvent.contentOffset;
        const pageIndex = Math.round(x / width)
        setCurrentPage(pageIndex)
    }



    return (


        <AnimatedFlatList
            horizontal
            getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index
            })}
            initialScrollIndex={initialPage}
            pagingEnabled
            data={items}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true },
            )}
            onScrollToIndexFailed={() => console.log("failed")}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
                const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                ];

                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8, 1, 0.8],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View
                        key={item.id}
                        style={{ flex: 1, transform: [{ scale }] }}
                    >

                        <View style={{ height: '100%', flexDirection: 'row' }}>
                            {renderMedia(item)}
                        </View>

                    </Animated.View>
                )

            }}

        />


    )
}


export default CustomCarousel