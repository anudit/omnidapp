import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
import { useAccountStore } from '../stores/accountStore';

const Settings = () => {

    const { basePubKey } = useAccountStore();

    return (
        <View>
            <Text>Settings</Text>
            <Text>Public: {basePubKey || "Not set"}</Text>
        </View>
    )
}
export default Settings;