import { Text } from "react-native";
import { Colors } from "../constants";

const CustomText = (props) => {
    const symbol = props.symbol || '##'
    const text = props.text?.split(' ');
    return <Text style={{ ...props.textStyle }}>{text?.map((text, index) => {
        if (text?.startsWith(props.symbol || '##')) {
            return <Text
                style={{ color: props.highlightedColor || Colors.primary, ...props.highlightedTextStyle }}>{text?.substring(props.includesSymbol ? symbol.length - 1 : symbol.length, text?.length)} </Text>;
        }

        return `${text} `;
    })}</Text>;
}
export default CustomText