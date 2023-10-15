import { TouchableWithoutFeedback, ScrollView, View, StyleSheet, Text } from "react-native";
import { Colors, assets } from "../constants";
import useColorScheme from "../hooks/useColorScheme";
import CustomImage from "./CustomImage";
import { MediumText } from "./StyledText";

const SearchFilters = ({ selectedFilter, setSelectedFilter, style, ...props }) => {
    const colorScheme = useColorScheme();
    const filters = props.filters || [
        {
            id: '0',
            title: 'Schools',
            icon: assets.grad_cap
        },
        {
            id: '1',
            title: 'Classes',
            icon: assets.book
        },
        {
            id: '2',
            title: 'Groups & Clubs',
            icon: assets.group
        },
        {
            id: '3',
            title: 'Study Buddies',
            text: "🤓"
        },
        {
            id: '4',
            title: 'Friends',
            icon: assets.add_friend
        },
        {
            id: '5',
            title: 'All Students',
            icon: assets.person
        }


    ]

    const isFilterSelected = (item) => {
        return item.title == selectedFilter;
    }

    const onFilterPress = (item) => {
        if (item.title == selectedFilter) {
            return setSelectedFilter(null)
        }
        else {
            setSelectedFilter(item.title)


        }
    }

    const FilterButton = ({ filter }) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => onFilterPress(filter)}>
                <View style={[styles.filterContainer, {
                    width: !isFilterSelected(filter) ? 50 : null,
                    backgroundColor: isFilterSelected(filter) ? Colors.accent : Colors[colorScheme].lightGray,
                }]}>


                    {filter?.text ?
                        <Text style={{ fontSize: 18 }}>{filter.text}</Text >
                        :
                        <CustomImage
                            tintColor={isFilterSelected(filter) ? Colors.white : Colors[colorScheme].darkGray}
                            source={filter.icon}
                            style={styles.icon}
                        />}
                    {isFilterSelected(filter) && <MediumText white style={{ marginLeft: 5 }}>{filter.title}</MediumText>}

                </View>
            </TouchableWithoutFeedback>

        )
    }

    return (
        <View style={{ ...style }}>


            <ScrollView

                showsHorizontalScrollIndicator={false}
                horizontal>
                {filters.map((item) => (
                    <FilterButton
                        key={item.id}
                        filter={item}
                    />

                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    filterContainer: {
        marginLeft: 15,
        flexDirection: 'row',
        padding: 8,
        paddingHorizontal: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },

    icon: {
        width: 22,
        height: 22,
    }
})
export default SearchFilters