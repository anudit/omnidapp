import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from "react-native";

import designTokens from '../assets/designTokens.json';

interface ButtonProps {
    title: string,
    iconRight?: React.ReactNode,
    iconLeft?: React.ReactNode
    isLoading?: boolean,
}

const Button = ({ title, iconRight, iconLeft, isLoading = false, ...props }: PressableProps & ButtonProps) => {
    return (
        <Pressable style={({ pressed }) => [styles.button, {
            backgroundColor: pressed ? designTokens.colors.background.level2 : designTokens.colors.background.level3,
        }]} {...props}>
            {isLoading === false ? iconLeft : (
                <ActivityIndicator size="small" color={designTokens.colors.text.primary} style={{ marginRight: 10 }} />
            )}
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
