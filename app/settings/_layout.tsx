import { Stack } from "expo-router";

import designTokens from '../../assets/designTokens.json';

export default function Home() {
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerShown: true,
                headerTintColor: designTokens.colors.text.primary,
                headerTitle: 'Settings',
                headerBlurEffect: 'light',
                headerStyle: {
                    backgroundColor: designTokens.colors.background.level2
                },
                headerBackButtonMenuEnabled: true
            }}
        >
            <Stack.Screen name="main" />
            <Stack.Screen name="zk" options={{ headerShown: true, headerTitle: 'ZK Id' }} />
        </Stack>
    );
}