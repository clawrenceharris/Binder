

import React, { useRef } from 'react';
import { ScrollView, SectionList, Text, UIManager, findNodeHandle, Animated } from 'react-native';

const AnimatedSectionList = ({ sections, renderItem, renderSectionHeader }) => {
    // const scrollViewRef = useRef(null);
    // const SectionListAnimated = Animated.createAnimatedComponent(SectionList)

    // const scrollY = useRef(new Animated.Value(0)).current;

    // const headerOpacity = scrollY.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: [0, 1],
    //     extrapolate: 'clamp',
    // });

    // const headerTranslateY = scrollY.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: [150, 100],
    //     extrapolate: 'clamp',
    // });

    // const fontSize = scrollY.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: [32, 24],
    //     extrapolate: 'clamp'

    // })

    // return (
    //         <SectionListAnimated
    //             sections={sections}
    //             renderSectionHeader={({ section }) => renderSectionHeader(section.title)}
    //             renderItem={({ item, index }) => renderItem(item, index)}
    //             onScroll={Animated.event(
    //                 [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    //                 { useNativeDriver: true }
    //             )}
    //         />
    // );
};

export default AnimatedSectionList;






