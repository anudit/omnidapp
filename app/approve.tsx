import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';
import designTokens from '../assets/designTokens.json';
import SwipeButton from 'rn-swipe-button';
import { AntDesign, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { ethers } from 'ethers';
import { Image } from 'expo-image';

type omnidAuthParams = {
    scope: string,
    response_type: 'code',
    redirect_uri: string,
    state: string,
    issuerSig: string,
    issuer: string
}

const orgData = {
    'microsoft': {
        name: 'Microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    }
}

const Prove = ({}) => {
    const routeParams = useLocalSearchParams();
    const [verifiedParams, setVerifiedParams] = useState<null | boolean>(null);

    const icon = useMemo(
        () => () => <AntDesign name="right" size={24} color="black" />,
        [],
    )

    useEffect(()=>{
        if(routeParams && Boolean(verifiedParams) === false){
            let {issuerSig, ...objWithoutSig} = routeParams as omnidAuthParams;
            let res = ethers.verifyMessage(
                JSON.stringify(objWithoutSig),
                issuerSig
            );
            setVerifiedParams(res == objWithoutSig.issuer);
        }
    }, [routeParams])

    const checkProof = () => {
        alert('Donezo')
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                routeParams ? verifiedParams === true ? (
                    <>
                        <View style={{...styles.row, alignItems:'center'}}>
                            <Text style={styles.text}>Share</Text>
                            <View style={{...styles.row, paddingVertical: 10, alignItems:'center'}}>
                                {
                                    Array.from(String(routeParams['scope']).split(',')).map((e, id)=><Text style={styles.textScope} key={id}>{e}</Text>)
                                }
                            </View>
                            <Text style={styles.text}>With</Text>
                            <View style={styles.card}>
                                <Image source={orgData['microsoft'].logo} style={{marginRight: 8, height: 40, width: 40}} contentFit="cover"/>
                                <View style={{display:'flex', flexDirection: 'column', justifyContent: 'space-between', width: '75%'}}>
                                    <Text style={styles.text}>{orgData['microsoft'].name}</Text>
                                    <Text style={styles.textSmall}>{routeParams['redirect_uri']}</Text>
                                </View>
                                <View style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 40}}>
                                    <MaterialIcons name="verified" size={24} color={designTokens.colors.text.disabled} />
                                </View>
                            </View>
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
                    </>
                ) : (
                    <View style={{...styles.row, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="small" style={{marginRight: 10}} />
                        <Text style={styles.textSmall}>Checking Request</Text>
                    </View>
                ) : (
                    <Text style={styles.textSmall}>Getting Data</Text>
                ) 
            }
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
    card: {
        borderColor: designTokens.colors.background.level1,
        borderWidth: 1,
        backgroundColor: designTokens.colors.background.level3,
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10
    },
    text: {
        color: designTokens.colors.text.primary,
        fontSize: 20
    },
    textSmall: {
        color: designTokens.colors.text.disabled,
        fontSize: 15
    },
    textScope: {
        color: designTokens.colors.text.primary,
        fontSize: 17
    },
    textCancel: {
        color: designTokens.colors.text.disabled,
        fontSize: 15,
        paddingVertical: 4
    },
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    }
});

export default Prove;