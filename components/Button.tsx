import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

import designTokens from '../assets/designTokens.json';

interface ButtonProps {
    title: string,
    iconRight?: React.ReactNode,
    iconLeft?: React.ReactNode
}

const Button = ({ title, iconRight, iconLeft, ...props }: PressableProps & ButtonProps) => {
    return (
        <Pressable style={styles.button} {...props}>
            {iconLeft}
            <Text style={styles.buttonText}>
                {title}
            </Text>
            {iconRight}
        </Pressable>
    )
}

export default Button;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: designTokens.colors.background.level3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonText: {
        color: designTokens.colors.text.primary,
    }
});
