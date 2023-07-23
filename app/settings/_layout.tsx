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
                    backgroundColor: designTokens.colors.background.level3
                },
                headerBackButtonMenuEnabled: true
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="zk" options={{ headerShown: true, headerTitle: 'ZK Id' }} />
        </Stack>
    );
}