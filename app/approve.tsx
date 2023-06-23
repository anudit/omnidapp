import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

type omnidAuthParams = {
    scope?: string,
    state?: string,
    issuerSig?: string,
    issuer?: string
}

const Prove = () => {

    const [proofData, setProofData] = useState<null | string>();

    useEffect(() => {
        const handleDeepLink = async (event) => {
            if (event.url) {
                const { path, queryParams } = Linking.parse(event.url);
                if (path === 'approve') {
                    setProofData(event.url);
                }
            }
        };
    
        Linking.addEventListener('url', handleDeepLink);
    }, [])

    return (
        <SafeAreaView>
            <Text>Prove</Text>
            <Text>{proofData || 'No Deeplink Data'}</Text>
            <Link href="/home">Back</Link>
        </SafeAreaView>
    )
}
export default Prove;