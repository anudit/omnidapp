import { Stack, Tabs } from 'expo-router';
import React from 'react';
import {View, Text} from 'react-native';

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
    )
}
export default StackLayout;