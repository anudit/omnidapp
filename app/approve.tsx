import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';
import { useSettingsStore } from '../stores/settings'
import designTokens from '../assets/designTokens.json';

type omnidAuthParams = {
    scope: string,
    response_type: 'code',
    redirect_uri: string,
    state: string,
    issuerSig: string,
    issuer: string
}

const Prove = ({}) => {
    const {count, increment} = useSettingsStore();
    const routeParams = useLocalSearchParams();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>{JSON.stringify(routeParams) || 'No Route Data'}</Text>
            <Link href="/home" style={styles.text}>Back</Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      backgroundColor: designTokens.colors.background.level2,
      minHeight: '100%',
      width: '100%',
      paddingHorizontal: 20
    },
    text: {
        color: designTokens.colors.text.primary,
        fontSize: 20
    }
});

export default Prove;