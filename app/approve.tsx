import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';
import designTokens from '../assets/designTokens.json';
import SwipeButton from 'rn-swipe-button';
import { AntDesign } from '@expo/vector-icons';

type omnidAuthParams = {
    scope: string,
    response_type: 'code',
    redirect_uri: string,
    state: string,
    issuerSig: string,
    issuer: string
}

const Prove = ({}) => {
    const routeParams = useLocalSearchParams();

    const icon = useMemo(
        () => () => <AntDesign name="right" size={24} color="black" />,
        [],
    )

    const checkProof = () => {
        alert('Donezo')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.text}>{JSON.stringify(routeParams) || 'No Route Data'}</Text>
            </View>

            <View style={{...styles.row, flexDirection: 'column', alignItems: 'center'}}>
                <SwipeButton 
                    shouldResetAfterSuccess
                    title="Swipe to Approve" 
                    containerStyles={{width: '100%'}} 
                    onSwipeSuccess={checkProof} 
                    railBackgroundColor={designTokens.colors.background.level1} 
                    railBorderColor={designTokens.colors.background.level3} 
                    thumbIconBorderColor={designTokens.colors.background.level2}
                    railFillBackgroundColor={designTokens.colors.background.level3+'BB'}
                    thumbIconComponent={icon}
                    titleColor={designTokens.colors.text.primary}
                />
                <Link href="/home" style={styles.textCancel}>Cancel</Link>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
      backgroundColor: designTokens.colors.background.level2,
      minHeight: '100%',
      width: '100%',
      paddingHorizontal: 20
    },
    text: {
        color: designTokens.colors.text.primary,
        fontSize: 20
    },
    textCancel: {
        color: designTokens.colors.text.disabled,
        fontSize: 15,
        paddingVertical: 4
    },
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    }
});

export default Prove;