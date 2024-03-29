import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwipeButton from 'rn-swipe-button';

import { verifyMessage } from 'viem';
import designTokens from '../../assets/designTokens.json';
import { useSettingsStore } from '../../stores/settings';

type omnidAuthParams = {
    scope: string,
    response_type: 'code',
    redirect_uri: string,
    state: string,
    issuerSig: `0x${string}`,
    issuer: `0x${string}`
}

const orgData = {
    'microsoft': {
        name: 'Microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    }
}

const Prove = () => {
    const routeParams = useLocalSearchParams();
    const [verifiedParams, setVerifiedParams] = useState<null | boolean>(null);
    const { shakeToCancel } = useSettingsStore();
    const router = useRouter();

    const icon = useMemo(
        () => () => <AntDesign name="right" size={24} color="black" />,
        [],
    )

    useEffect(() => {
        if (routeParams && Boolean(verifiedParams) === false) {
            try {
                const { issuerSig, ...objWithoutSig } = routeParams as omnidAuthParams;
                verifyMessage({
                    address: objWithoutSig.issuer,
                    message: JSON.stringify(objWithoutSig),
                    signature: issuerSig
                }).then(setVerifiedParams);

            } catch (error) {
                console.error('verif error', error, routeParams)
                setVerifiedParams(false)
            }
        }
    }, [routeParams])

    useEffect(() => {

        let accelerometerSubscription;

        const handleShake = () => {
            router.push("/")
            Toast.show('Cancelled Request', {
                duration: Toast.durations.SHORT,
            });

        };

        const subscribeToShakeDetection = async () => {
            // Subscribe to accelerometer sensor updates
            accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
                // Calculate the total acceleration vector
                const acceleration = Math.sqrt(x * x + y * y + z * z);

                // Define a threshold to detect shake events
                const shakeThreshold = 1.8;

                if (acceleration > shakeThreshold) {
                    // Shake event detected
                    handleShake();
                }
            });

        };

        const startShakeDetection = async () => {

            // Activate the keep awake feature to prevent the device from sleeping
            activateKeepAwakeAsync();

            // Subscribe to the shake detection
            await subscribeToShakeDetection();
        };

        const stopShakeDetection = () => {
            // Unsubscribe from shake detection
            accelerometerSubscription?.remove();

            // Deactivate the keep awake feature
            deactivateKeepAwake();
        };

        if (shakeToCancel) startShakeDetection();

        // Stop shake detection and clean up when the component unmounts
        return () => {
            stopShakeDetection();
        };
    }, []);


    const checkProof = () => {
        alert('Donezo')
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                routeParams ? verifiedParams === true ? (
                    <>
                        <View style={{ ...styles.row, alignItems: 'center' }}>
                            <Text style={styles.text}>Share</Text>
                            <View style={{ ...styles.row, paddingVertical: 10, alignItems: 'center' }}>
                                {
                                    Array.from(String(routeParams['scope']).split(',')).map((e, id) => <Text style={styles.textScope} key={id}>{e}</Text>)
                                }
                            </View>
                            <Text style={styles.text}>With</Text>
                            <View style={styles.card}>
                                <Image source={orgData['microsoft'].logo} style={{ marginRight: 8, height: 40, width: 40 }} contentFit="cover" />
                                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '75%' }}>
                                    <Text style={styles.text}>{orgData['microsoft'].name}</Text>
                                    <Text style={styles.textSmall}>{routeParams['redirect_uri']}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 40 }}>
                                    <MaterialIcons name="verified" size={24} color={designTokens.colors.text.disabled} />
                                </View>
                            </View>
                        </View>

                        <View style={{ ...styles.row, flexDirection: 'column', alignItems: 'center' }}>
                            <SwipeButton
                                shouldResetAfterSuccess
                                title="Swipe to Approve"
                                containerStyles={{ width: '100%' }}
                                onSwipeSuccess={checkProof}
                                railBackgroundColor={designTokens.colors.background.level1}
                                railBorderColor={designTokens.colors.background.level3}
                                thumbIconBorderColor={designTokens.colors.background.level2}
                                railFillBackgroundColor={designTokens.colors.background.level3 + 'BB'}
                                // @ts-expect-error shut up ts.
                                thumbIconComponent={icon}
                                titleColor={designTokens.colors.text.primary}
                            />
                            <Link href="/" style={styles.textCancel}>Cancel</Link>
                        </View>
                    </>
                ) : (
                    <View style={{ ...styles.row, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" style={{ marginRight: 10 }} />
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
        alignItems: 'center',
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